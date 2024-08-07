import express from 'express';
import 'express-async-errors';
import { signUpRouter } from './routes';
import { errorHandler } from './middlewares';

const app = express();

app.use(express.json());

app.use(signUpRouter);

app.use(errorHandler);

export default app;
