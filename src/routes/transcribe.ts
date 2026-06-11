import { Router } from "express";
import type { Request, Response } from "express";
import { groqClient } from "../lib/groq.ts";
import multer from "multer";
import { toFile } from "groq-sdk";

export const transcribeRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowed = [
      "audio/webm",
      "audio/mp4",
      "audio/wav",
      "audio/mpeg",
      "audio/ogg",
    ];
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported audio format: ${file.mimetype}`));
    }
  },
});

transcribeRouter.post(
  "/",
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    try {
      const audioFile = await toFile(
        req.file.buffer,
        req.file.originalname || "recording.webm",
        {
          type: req.file.mimetype,
        },
      );

      const transcription = await groqClient.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-large-v3-turbo", // fastest Groq Whisper model
        response_format: "json",
        language: "en", // remove this line to enable auto-detect
      });

      console.log(transcription);

      res.json({ text: transcription.text });
    } catch (error) {
      console.error("Transcription Error:", error);

      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);
