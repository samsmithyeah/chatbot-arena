import { OpenAI } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const openai = new OpenAI();

      const { messages, model } = req.body;

      const response = await openai.chat.completions.create({
        model,
        messages,
      });

      res.status(200).json({
        message: response.choices[0].message.content,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
