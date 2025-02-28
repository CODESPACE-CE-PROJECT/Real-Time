import { Request, Response } from "express";
import { RequestWithUser } from "../interfaces/auth.interface";
import { userService } from "../services/user.service";
import { redisClient, subscribeTopic } from "../services/redis.service";

export const realTimeController = {
  updateStatusUser: async (req: Request, res: Response) => {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };

    res.writeHead(200, headers);
    res.write(`data: ${(req as RequestWithUser).user.username} connected\n\n`);
    const ip =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "";

    const token = (req as RequestWithUser).user.token;

    userService.updateStatusActive(token, true, ip as string);

    req.on("close", () => {
      userService.updateStatusActive(token, false, ip as string);
    });
  },

  getResultSubmission: async (req: Request, res: Response) => {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);
    res.write(`data: ok\n\n`);
    const username = (req as RequestWithUser).user.username;
    const submissionState = await redisClient.get(
      `submissionState-${username}`,
    );
    const cacheData = await redisClient.get(`submission-${username}`);
    const updateData = {
      ...JSON.parse(cacheData as string),
      submissionState: submissionState,
    };
    if (cacheData) {
      res.write(`data: ${JSON.stringify(updateData)} \n\n`);
    }
    await subscribeTopic("submission", async (message: any) => {
      const messageJson = JSON.parse(message);
      const submissionState = await redisClient.get(
        `submissionState-${username}`,
      );
      if (username === messageJson.username) {
        res.write(
          `data: ${JSON.stringify({ ...messageJson, submissionState })} \n\n`,
        );
      }
    });
  },

  getResultCompile: async (req: Request, res: Response) => {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);
    res.write(`data: ok\n\n`);

    const username = (req as RequestWithUser).user.username;
    const cacheData = await redisClient.get(`compiler-${username}`);
    if (cacheData) {
      res.write(`data: ${cacheData} \n\n`);
    }
    await subscribeTopic("compiler", (message: any) => {
      const messageJson = JSON.parse(message);
      if (username === messageJson.username) {
        res.write(`data: ${message} \n\n`);
      }
    });
  },
};
