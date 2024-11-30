import { Request, Response } from "express"
import { RequestWithUser } from "../interfaces/auth.interface";
import { userService } from "../services/user.service";
import { checkRedisHealth, redisClient, redisDisconnect, subscribeTopic } from "../services/redis.service";

export const realTimeController = {
  updateStatusUser: async (req: Request, res: Response) => {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };

    res.writeHead(200, headers)
    res.write(`data: ${(req as RequestWithUser).user.username} connected\n\n`)
    const ip =
      req.headers['cf-connecting-ip'] ||
      req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress || '';

    const token = (req as RequestWithUser).user.token

    userService.updateStatusActive(token, true, ip as string)

    req.on('close', () => {
      userService.updateStatusActive(token, false, ip as string)
    })
  },

  getResultSubmission: async (req: Request, res: Response) => {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers)

    await subscribeTopic('submission', (message: any) => {
      console.log(message)
    })

    req.on('close', async () => {
      await redisDisconnect()
    })

    req.on('error', async () => {
      await redisDisconnect()
    })
  },

  getResultCompile: async (req: Request, res: Response) => {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers)

    await subscribeTopic('compiler', (message: any) => {
      console.log(message)
    })

    req.on('close', async () => {
      await redisDisconnect()
    })

    req.on('error', async () => {
      await redisDisconnect()
    })
  }
}
