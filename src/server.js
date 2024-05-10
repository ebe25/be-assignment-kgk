import express from "express";
import {PORT} from "./config/server.js";
import appRouter from "./routes/index.js";
async function init() {
  try {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use("/api", appRouter);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} 🚀`);
    });
  } catch (error) {
    throw error;
  }
}

init();
