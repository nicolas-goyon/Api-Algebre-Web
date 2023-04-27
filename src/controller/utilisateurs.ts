import express from 'express';
import { db } from '../rooter/database';
import { Utilisateur } from '../models';
export const router = express.Router();
// Route : /utilisateur
/* -------------------------------------------------------------------------- */
/*                                   ROUTER                                   */
/* -------------------------------------------------------------------------- */


declare global {
    namespace Express {
        interface Request {
            context: any
        }
    }
}


router.get('/me', async (req, res) => {
    if (req.context === null || req.context === undefined) {
        res.status(401).json('Utilisateur non connecté');
        return;
    }
    let data = {
        pseudo : req.context.pseudo,
        email : req.context.email,
    }
    res.json(data); // TODO : return 404 if null
    // res.status(401).json('Utilisateur non connecté');
});


















/* -------------------------------------------------------------------------- */
/*                              DEPRECIATED CODE                              */
/* -------------------------------------------------------------------------- */
// TODO : remove this code

router.get('/getAllUtilisateurs', async (req, res) => {
    let query = await db
        .selectFrom(Utilisateur.table_name)
        .selectAll()
        .execute()
    res.json(query); // TODO : return 404 if null
});

router.get('/getUtilisateurById/:id', async (req, res) => {
    let query = await Utilisateur.getUtilisateurById(Number(req.params.id));
    res.json(query); // TODO : return 404 if null
});

router.get('/addUtilisateur/:pseudo/:password/:email', async (req, res) => {
    let data = { // TODO : make this function with body values and post method
        pseudo: req.params.pseudo,
        email: req.params.email,
        password: req.params.password,
    }
    let user = new Utilisateur(null, data.pseudo, data.password, data.email, null);
    await user.save();
    res.json(200); // FIXME : check if save is ok
});

router.post('/deleteUtilisateurById/:id', async (req, res) => {
    let deleteLine = new Utilisateur(Number(req.params.id), "", "", "", null);
    await deleteLine.delete();
    res.json(200); // FIXME : check if delete is ok
});

router.put('/updateUtilisateurById/:id', async (req, res) => {
    let data = {
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: req.body.password,
    }
    let user = new Utilisateur(Number(req.params.id), data.pseudo, data.password, data.email, null);
    await user.save();
    res.json(200); // FIXME : check if save is ok
});

router.get('/createTable', async (req, res) => {
    // await Utilisateur.createTableUtilisateur();
    res.json(200); // FIXME : check if create is ok
});

// Check password and pseudo
router.post('/checkPassword', async (req, res) => {
    let data = {
        pseudo: req.body.pseudo,
        password: req.body.password,
    }
    let user = await Utilisateur.getUtilisateurByPseudo(data.pseudo);
    if (user !== null) {
        if (user.getPassword() === data.password) {
            res.json(200);
        } else {
            res.json(409);
        }
    } else {
        res.json(409);
    }
});

// Check if pseudo is already used
router.get('/check/:pseudo', async (req, res) => {
    let data = { // TODO : make this function with body values and post method
        pseudo: req.params.pseudo,
    }
    let user = await Utilisateur.getUtilisateurByPseudo(data.pseudo);
    if (user !== null) {
        res.json(200);
    } else {
        res.json(409);
    }
});

// Check if email is already used
router.get('/check/:email', async (req, res) => {
    let data = { // TODO : make this function with body values and post method
        email: req.params.email,
    }
    let user = await Utilisateur.getUtilisateurByEmail(data.email);
    if (user !== null) {
        res.json(200);
    } else {
        res.json(409);
    }
});

/* -------------------------------------------------------------------------- */
/*                                 FIN ROUTER                                 */
/* -------------------------------------------------------------------------- */

