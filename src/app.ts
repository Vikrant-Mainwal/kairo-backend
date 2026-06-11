import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.ts';
import { chatRouter } from './routes/route.chat.ts';
import { transcribeRouter } from './routes/route.transcribe.js';

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// checking if server is running
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/chat', chatRouter);
app.use('/transcribe', transcribeRouter);
app.use(errorHandler);

export default app;