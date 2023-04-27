import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import router from './rooter';
import cookieParser from 'cookie-parser';
import { middlewares, authMiddlewares } from './middlewares';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use(authMiddlewares.authenticate);
// add middleware here before middlewares.[...]
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.use('/' , router);


export default app;
