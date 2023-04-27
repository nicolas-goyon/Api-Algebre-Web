import { NextFunction, Request, Response } from 'express';
import { Token } from '../models';

import ErrorResponse from '../interfaces/ErrorResponse';


export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) req.context = null;
    else {
        const tokenItem = await Token.getTokenByToken(token)
        if (tokenItem == null) req.context = null;
        else {
            req.context = await tokenItem.getUser();
            req.context.token = token;
        }
        
    }
    next();
    // return;
}