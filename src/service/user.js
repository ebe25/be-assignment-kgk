import UserRepositary from "../repositary/user.js";
import {comparePasswords} from "../utils/helper/hashing.js";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  redisClient,
} from "../config/server.js";

const {sign, verify} = jwt;

class UserService {
  constructor() {
    this.repo = new UserRepositary();
  }

  //creates a JWT token, private instance method
  #createTokens = async (
    payload,
    accessTokenPrivateKey,
    refreshTokenPrivatekey
  ) => {
    try {
      const accessToken = sign(payload, accessTokenPrivateKey, {
        expiresIn: "1hr",
      });
      const refreshToken = sign(payload, refreshTokenPrivatekey, {
        expiresIn: "24hr",
      });
      return {accessToken, refreshToken};
    } catch (error) {
      throw new Error("Something went wrong while generating jwt token");
    }
  };

  async register(username, password) {
    try {
      const newUser = await this.repo.register(username, password);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async login(username, password) {
    try {
      const dbUser = await this.repo.getUserByUsername(username);
      if (!dbUser) {
        throw new Error("No User found! ❌");
      }

      const isPasswordMatch = await comparePasswords(password, dbUser.password);

      if (!isPasswordMatch) {
        throw new Error("Invalid Password! Does'nt match 👎🏻, Try again");
      }

      const tokens = this.#createTokens(
        dbUser,
        ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET
      );
      return tokens;
    } catch (error) {
      console.log(error);
      const {message} = error;
      throw error;
    }
  }

  async logout(tokens) {
    //user opts for logout- specifically will blacklist those tokens and they will be never used again
    try {
      const {access_token, refresh_token} = tokens;
      const access_token_payload = verify(access_token, ACCESS_TOKEN_SECRET);
      console.log(access_token_payload)
      const key = access_token_payload.id;
      if (key) {
        await redisClient.hSet(`${key}`, {
          "invalid-access-token": access_token,
          "invalid-refresh-token": refresh_token,
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
export default UserService;
