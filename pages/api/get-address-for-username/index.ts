// pages/api/index.ts
import { VercelRequest, VercelResponse } from "@vercel/node";

const handler = async (
  _req: VercelRequest,
  res: VercelResponse
) => {
    try {
        return res.status(200).json("hello world");
    }
    catch(err) {
        return res.status(500).json(err);
    }
}

export default handler;