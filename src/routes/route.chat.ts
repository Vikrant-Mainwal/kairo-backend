import type { Request, Response } from "express";
import { Router } from "express";
import { groqClient } from "../lib/groq.js";

export const chatRouter = Router();

interface chatBody {
  prompt: string;
  model: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

chatRouter.post("/", async (req: Request, res: Response) => {
  const {
    prompt,
    model,
    systemPrompt = "You are a helpful assistant.",
    temperature = 0.7,
    maxTokens = 100,
  }: chatBody = req.body;

  if (!prompt || !model) {
    return res.status(400).json({
      error: "Prompt and model are required.",
    });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  try {
    const stream = await groqClient.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const text = chunk.choices?.[0]?.delta?.content ?? "";

      if (text) {
        res.write(
          `data: ${JSON.stringify({
            choices: [
              {
                delta: {
                  content: text,
                },
              },
            ],
          })}\n\n`,
        );
      }
    }

    console.log("Sending DONE");
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error(error);

    res.write(
      `data: ${JSON.stringify({
        error: "Stream interrupted",
      })}\n\n`,
    );

    res.end();
  }
});
