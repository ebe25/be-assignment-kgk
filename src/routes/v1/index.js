import express, {Router} from "express";
import UserController from "../../controller/user.js";
import {
  checkRefreshToken,
  refreshTokenValidator,
  registerUserValidator,
  verifyToken,
} from "../../middlewares/authentication.js";
const v1router = express.Router();

const user = new UserController();

v1router.post("/register", registerUserValidator, user.register);
v1router.post("/login", registerUserValidator, user.login);

//refresh-tokens
v1router.post("/refresh/:id", refreshTokenValidator, user.refresh);

//protected routes
v1router.get("/dashboard", verifyToken, (req, res) => {
  
  res.status(200).json({
    data: `Welcome to dashboard ${req.user.username}! 💻`,
    success: true,
    message: "DashBoard Access Granted> ✅",
  });
});
v1router.get("/wallet", verifyToken, (req, res) => {
  res.status(200).json({
    data: `${req.user.username}'s wallet 👜`,
    success: true,
    message: " Wallet Access Granted> ✅",
  });
});

//todo -> create common middleware that handles the presence of token in the request header
v1router.post("/logout",checkRefreshToken, user.logout);

export default v1router;
