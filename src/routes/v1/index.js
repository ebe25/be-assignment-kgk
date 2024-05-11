import express, {Router} from "express";
import UserController from "../../controller/user.js";
import {
  refreshTokens,
  registerUserValidator,
  verifyToken,
} from "../../middlewares/authentication.js";
const v1router = express.Router();

const user = new UserController();

v1router.post("/register", registerUserValidator, user.register);
v1router.post("/login", registerUserValidator, user.login);

//refresh-tokens
v1router.post("/refresh/:id", user.refresh);

//protected routes

v1router.get("/dashboard", verifyToken, (req, res) => {
  res.status(200).json({
    data: `Welcome to dashboard ${req.body.username}! 💻`,
    success: true,
    message: "Token verified. Access Granted> ✅",
  });
});
// v1router.get("/admin", user.get);
// v1router.get("/wallet", user.get);

//todo -> create common middleware that handles the presence of token in the request header
v1router.post("/logout", user.logout);

export default v1router;
