import {z} from "zod";
import jwt from "jsonwebtoken";
import {ACCESS_TOKEN_SECRET, redisClient} from "../config/server.js";
import UserRepositary from "../repositary/user.js";
const {verify} = jwt;
const user = new UserRepositary();
export const registerUserValidator = (req, res, next) => {
  const {username, password} = req.body;
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
  /**Password must contain one digit from 1 to 9, one lowercase letter,
   * one uppercase letter,
   * one special character, no space,
   * and it must be 8-16 characters long. */

  const userSchema = z.object({
    username: z.string().email(),
    password: z
      .string()
      .min(8, {message: "Password must be 8 characters long"})
      .regex(passwordRegex, {
        message:
          "Invalid password. Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.",
      }),
  });
  try {
    // as schema is a obj, parsing with a string would be wrong lmao silly me!
    userSchema.parse(req.body);
    next();
  } catch (error) {
    const missingFields = error.issues.map(
      (issue) => issue.path + " " + issue.message.toLowerCase()
    );
    return res.status(400).send({
      data: {},
      message: `${missingFields.join(",")}`,
      success: false,
      err: error.issues[0],
    });
  }
};

export const verifyToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({
      data: {},
      message: "UnAuthorized. Token not provided",
      success: false,
      err: "Missing access token",
    });
  }
  const access_token = req.headers?.authorization?.split(" ")[1];
  try {
    const access_token_payload = verify(access_token, ACCESS_TOKEN_SECRET);
    console.log( access_token_payload.payload)
    const {id} = access_token_payload.payload;
    const invalidTokens = await TokensInBlackList(id.toString());
    //checking if the token is invalid. i.d user has logged out
    if (invalidTokens["invalid-access-token"] === access_token) {
      return res.status(403).send({
        data: null,
        message: "User logged out. Login again",
        err: "Invalid token",
        success: false,
      });
    }
    const userDb = await user.getUserById(id);
    req.user = userDb;
    next();
  } catch (error) {
    console.log("error in verifying token", error)
    if (error.name === "JsonWebTokenError") {
      return res.status(400).send({
        data: error.name,
        message: `Malformed token. Access Denied, check your Token ❌`,
        success: false,
        err: `${error.message}`,
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(403).send({
        data: error.name,
        message: `Forbidden. Access Denied ❌, Refresh the token`,
        success: false,
        err: `${error.message}`,
      });
    } else {
      return res.status(500).send({
        data: error.name,
        message: error.message,
        success: false,
        err: "Internal server error",
      });
    }
  }
};

export const TokensInBlackList = async (userId) => {
  try {
    // const {username} = await user.getUserById(Number(userId));
    const response = await redisClient.HGETALL(userId);
    return response;
  } catch (error) {
    throw error;
  }
};

export const refreshTokenValidator = async (req, res, next) => {
  if (!req.headers["x-refresh-token"]) {
    return res.status(400).send({
      data: null,
      message: `Bad request refresh token not provided.`,
      success: false,
      err: "Bad request",
    });
  }
  next();
};


export const checkRefreshToken = (req, res, next) => {
  const accessToken = req.headers.authorization;
  const refreshToken = req.headers["x-refresh-token"];
  if (!accessToken || !refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Access token or refresh token not provided.",
    });
  }
  next();
};