import express from 'express';
import routes from './routes';

const { signUpRouter } = routes;

const app = express();

app.use(express.json());

app.use(signUpRouter);

export default app;
