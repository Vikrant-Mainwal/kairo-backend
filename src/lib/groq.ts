import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

if(!process.env.GROQ_API_KEY){
    throw new Error("GROQ_API_KEY is not set in environment variables");
}

export const groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

// Models

export const GROQ_MODELS = {
  LLAMA3_8B: "llama3-8b-8192",
  LLAMA3_70B: "llama3-70b-8192",
  MIXTRAL: "mixtral-8x7b-32768",
  GEMMA: "gemma-7b-it",
} as const;

export type GroqModel = (typeof GROQ_MODELS)[keyof typeof GROQ_MODELS];