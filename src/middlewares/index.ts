import express from "express";
import * as middlewares from './middlewares';
import * as authMiddlewares from './auth';
export { middlewares, authMiddlewares };

// export default function useMiddlewares(app: express.Application){
//     app.use(middlewares.notFound);
//     app.use(middlewares.errorHandler);
//     app.use(authMiddlewares.authenticate);
// }