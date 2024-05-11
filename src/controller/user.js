import {
  ACCESS_TOKEN_SECRET,
  EXPIRE_REFRESH_TOKEN_THRESHOLD,
  REFRESH_TOKEN_SECRET,
} from "../config/server.js";
import {TokensInBlackList} from "../middlewares/authentication.js";
import UserService from "../service/user.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/helper/tokens.js";

class UserController {
  constructor() {
    this.service = new UserService();
  }

  register = async (req, res) => {
    const {username, password} = req.body;
    try {
      const newUser = await this.service.register(username, password);
      return res.status(201).send({
        data: newUser,
        message: "User registered Sucessfully. ✅",
        success: true,
        err: {},
      });
    } catch (error) {
      return res.status(500).send({
        data: {},
        message: "User registration failed",
        success: false,
        err: error,
      });
    }
  };

  login = async (req, res) => {
    const {username, password} = req.body;
    try {
      const tokens = await this.service.login(username, password);
      return res.status(200).send({
        data: tokens,
        message: "User logged-in Sucessfully. ✅",
        success: true,
        err: {},
      });
    } catch (error) {
      return res.status(401).send({
        data: {},
        message: "Un-Authorized. Please check your credentials",
        success: false,
        err: error,
      });
    }
  };

  logout = async (req, res) => {
    const access_token = req.headers.authorization.split(" ")[1];
    const refresh_token = req.headers["x-refresh-token"];
    const tokens = {access_token, refresh_token};
    try {
      await this.service.logout(tokens);
      return res.status(200).send({
        data: {},
        message: "User logged out sucessfully!",
        sucess: true,
        err: {},
      });
    } catch (error) {
      return res.status(500).send({
        data: {},
        message: error.message,
        sucess: false,
        err: error.name,
      });
    }
  };

  refresh = async (req, res) => {
    const refresh_token = req.headers["x-refresh-token"];
    const userId = req.params.id;
    // const user = get

    try {
      const tokensDB = await TokensInBlackList(userId);
      if (tokensDB["invalid-refresh-token"] === refresh_token) {
        return res.status(403).send({
          err: "Invalid refresh token",
          success: false,
          message: "Session lost.Login again!",
        });
      }
      //verify refreshtoken
      const refreshTokenPayload = jwt.verify(
        refresh_token,
        REFRESH_TOKEN_SECRET
      );
      if (!(refreshTokenPayload.id == userId)) {
        return res.status(400).send({
          err: "Invalid refresh token",
          success: false,
          message: "User not found, try again",
        });
      }

      //issue new access-token
      const new_access_token = generateAccessToken(refreshTokenPayload);
      // if the expiration time of the current refresh token lesseer than the threshold, generate new refreshtoken
      const validity_of_current_refresh_token =
        refreshTokenPayload.exp - Math.floor(new Date() / 1000);
      let new_refresh_token = "";
      if (validity_of_current_refresh_token < EXPIRE_REFRESH_TOKEN_THRESHOLD) {
        new_refresh_token += generateRefreshToken(refreshTokenPayload);
      }

      return res.status(200).send({
        data: {new_access_token, new_refresh_token},
        success: true,
        message: "New Acess_token issued!",
        err: null,
      });
    } catch (error) {
      return res.status(500).send({
        data: null,
        success: false,
        message: error.message,
        err: error.name,
      });
    }
  };
}

export default UserController;
