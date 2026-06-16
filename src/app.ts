import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import { chatRouter } from './routes/route.chat.js';
import { transcribeRouter } from './routes/route.transcribe.js';

const app = express();

app.use(cors({ origin: "https://sarvam-kairo.vercel.app/" }));
app.use(express.json());

// checking if server is running
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/chat', chatRouter);
app.use('/transcribe', transcribeRouter);
app.use(errorHandler);

export default app;
