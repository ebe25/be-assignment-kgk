import UserService from "../service/user.js";
import jwt from "jsonwebtoken";

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

  // isAuthenticated = (req, res) => {
  //   const token = req.headers.authorization.split(" ")[1];
  //   console.log(token);
  //   res.send("cool")
  //   // try {

  //   // } catch (error) {

  //   // }
  // };

  logout = async (req, res) => {
    const access_token = req.headers.authorization.split(" ")[1];
    const refresh_token = req.headers['x-refresh-token'];
    const tokens = {access_token, refresh_token}
    try {
      await this.service.logout(tokens);
      return res.status(200).send({
        data: {},
        message: "User logged out sucessfully!",
        sucess: true,
        err: {},
      });
    } catch (error) {
      console.log(error)
      return res.status(500).send({
        data: {},
        message: error.message,
        sucess: false,
        err: error,
      });
    }
  };
}

export default UserController;
