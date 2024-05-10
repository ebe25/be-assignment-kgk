import express from "express";
import v1router from "./v1/index.js";
const appRouter = express.Router();

appRouter.use("/v1", v1router)

export default appRouter;