import express, { Router } from "express";
import UserController from "../../controller/user.js";
import { registerUserValidator } from "../../middlewares/authentication.js";
const v1router = express.Router();

const user = new UserController();

v1router.post("/register", registerUserValidator, user.register);
// v1router.get("/register", registerUserValidator,user.get);

export default v1router;