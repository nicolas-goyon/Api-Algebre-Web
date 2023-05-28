import express from 'express';
import { db } from '../rooter/database';
import { Token, Utilisateur } from '../models';
export const router = express.Router();
// Route : /utilisateur
/* -------------------------------------------------------------------------- */
/*                                   ROUTER                                   */
/* -------------------------------------------------------------------------- */


router.get('/', async (req, res) => {
    if (req.context === null || req.context === undefined) {
        res.status(401).json('Utilisateur non connecté');
        return;
    }
    let data = {
        pseudo : req.context.pseudo,
        email : req.context.email,
    }
    res.json(data).status(201); // TODO : return 404 if null
});
