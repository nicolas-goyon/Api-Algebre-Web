import express from 'express';
import { Utilisateur } from '../models';
export const router = express.Router();

router.get('/login/:email/:password', async (req, res) => {
    let data = {
        email: req.params.email,
        password: req.params.password,
    }
    let query = await Utilisateur.getDataUtilisateurByEmail(data.email);
    if (query !== undefined) {
        if (query.password === data.password) {
            res.status(200).json('Connexion réussie'); // TODO : créer un token
        }
        else {
            res.status(401).json('Mot de passe ou email incorrect'); // Mot de passe incorrect
        }
    }
    else {
        res.status(404).json('Mot de passe ou email incorrect'); // Utilisateur non trouvé
    }
});