import express from 'express';
import { signUpRouter } from './routes';

const app = express();

app.use(express.json());

app.use(signUpRouter);

export default app;
