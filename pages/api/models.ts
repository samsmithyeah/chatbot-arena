import type { NextApiRequest, NextApiResponse } from "next";

const getLLMs = async () => {
  try {
    const response = await fetch(`${process.env.PROMPT_SERVICE_URL}/llm`);
    const llmModels = await response.json();
    return llmModels;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to fetch LLMs, error: " + error.message);
    } else {
      throw new Error("Failed to fetch LLMs, error: " + String(error));
    }
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const llmModels = await getLLMs();
      res.status(200).json({
        message: llmModels,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
