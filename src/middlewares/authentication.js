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
    // console.log(parsed);
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
  //have to have some user realted detail in the request body, assuming it is a protected route middleware
  if (!req.body.username) {
    return res.status(400).send({
      success: false,
      err: "Username is required", //just an assumption to work around with this middleware
    });
  }
  const {username} = req.body;
  const token = req.headers?.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send({
      data: {},
      message: "UnAuthorized. Token not provided",
      success: false,
      err: "Missing access token",
    });
  }
  try {
    const access_token_payload = verify(token, ACCESS_TOKEN_SECRET);
    const usernameDb = await user.getUserByUsername(username);
    if (access_token_payload.username === usernameDb) {
      return res.status(200).send({
        data: {},
        message: "Valid and verified token. Access Granted ✅",
        err: {},
        success: true,
      });
    }
    next();
  } catch (error) {
    console.log("err", error);
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
    }
  }
};

export const refreshTokens = async (username, access_token) => {
  try {
    //check if the user has logged out , checking the invalid/blacklisted tokens in the redis cache
    // const tokenDetails = await redisClient.HGET(username,"invalid-refresh-token ");
    // console.log("token details ", tokenDetails);

    const res = await redisClient.HGETALL(username);
    console.log(res["invalid-refresh-token"])
    return res
  } catch (error) {
    throw error;
  }
};
