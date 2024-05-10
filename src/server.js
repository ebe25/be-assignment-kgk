import express from "express";
import {PORT} from "./config/server.js";
import {redisClient} from "./config/server.js";
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
    
    redisClient.on('error', err => console.log('Redis Client Error', err));
    await redisClient.connect()
  } catch (error) {
    throw error;
  }
}

init();
