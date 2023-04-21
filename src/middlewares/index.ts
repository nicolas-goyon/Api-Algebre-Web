import express from "express";
import * as middlewares from './middlewares';

export default function useMiddlewares(app: express.Application){
    app.use(middlewares.notFound);
    app.use(middlewares.errorHandler);
}