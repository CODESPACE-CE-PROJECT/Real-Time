import express, { Application, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import os from "os";
import helmet from "helmet";
import cluster from "cluster";
import logger from "./utils/logger";

// Router
import { serverRouter } from "./routes/server.route";
import { environment } from "./config/environment";
import { realTimeRouter } from "./routes/realtime.route";
import { redisClient } from "./services/redis.service";

config();

const app: Application = express();
const coreTotal: number = Math.min(os.cpus().length, 2);
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// API Route
app.use("/", serverRouter);
app.use("/", realTimeRouter);

const errorHandler = async (
  err: any,
  _req: Request,
  res: Response,
  next: any,
) => {
  console.log(err);

  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode).json({
    message: "Eroor!!",
  });
  next();
};

app.use(errorHandler);

if (cluster.isPrimary) {
  for (let i = 0; i < coreTotal; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, _code, _signal) => {
    logger.info(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.listen(environment.PORT, "0.0.0.0", () => {
    logger.info(`Server ready on port ${environment.PORT}`);
    redisClient.connect();
  });
}
