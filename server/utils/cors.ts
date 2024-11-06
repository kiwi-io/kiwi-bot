import { VercelRequest, VercelResponse } from "@vercel/node";
import { HTTP_ERRORS } from "../../constants";

const allowedOrigins = [
  "https://heykiwi.io",
  "https://www.heykiwi.io",
  "https://kiwi-bot.vercel.app",
  "https://www.kiwi-bot.vercel.app"
];

export type VercelApiHandler = (
  req: VercelRequest,
  res: VercelResponse,
) => void | Promise<VercelResponse>;

export const allowCors =
  (fn: VercelApiHandler) => async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (!req.headers.origin) {
      res.status(404);
      return res.send(HTTP_ERRORS.ORIGIN_NOT_SET);
    }
    
    if (
      process.env.VERCEL_ENV === "production" &&
      allowedOrigins.indexOf(req.headers.origin) === -1
    ) {
      res.status(404).end();
      return res.send(HTTP_ERRORS.UNKNOWN_ORIGIN);
    }

    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    );
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }
    return await fn(req, res);
  };
