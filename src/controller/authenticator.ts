import express from 'express';
import { Token, Utilisateur } from '../models';
export const router = express.Router();

router.post('/login', async (req, res) => {
    let data = {
        email: req.body.email,
        password: req.body.password,
    }
    let query = await Utilisateur.getDataUtilisateurByEmail(data.email);
    
    if (query === undefined || query === null) {
        res.status(409).json('Mot de passe ou email incorrect'); // Utilisateur non trouvé
        return;
    }

    if (query.password !== data.password) {
        res.status(409).json('Mot de passe ou email incorrect'); // Mot de passe incorrect
        return;
    }


    const token = await Token.generateToken(query.id);
    res.status(201)
        .json({
            token: token.getToken(),
    });


});

// check if username is already taken
router.get('/check/email/:email', async (req, res) => {
    let data = {
        email: req.params.email,
    }
    let query = await Utilisateur.getDataUtilisateurByEmail(data.email);
    if (query !== undefined) {
        res.status(409).json('Email déjà utilisé');
    }
    else {
        res.status(201).json('Email disponible');
    }
});

router.get('check/username/:username', async (req, res) => {
    let data = {
        username: req.params.username,
    }
    let query = await Utilisateur.getDataUtilisateurByPseudo(data.username);
    if (query !== undefined) {
        res.status(409).json('Nom d\'utilisateur déjà utilisé');
    }
    else {
        res.status(201).json('Nom d\'utilisateur disponible');
    }
});

router.post('/signup', async (req, res) => {
    let data = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    }
    let query = await Utilisateur.getDataUtilisateurByEmail(data.email);
    if (query !== undefined) {
        res.status(409).json('Email déjà utilisé');
    }
    else {
        let query = await Utilisateur.getDataUtilisateurByPseudo(data.username);
        if (query !== undefined) {
            res.status(409).json('Nom d\'utilisateur déjà utilisé');
        }
        else {
            let newUser = new Utilisateur(null, data.username, data.password, data.email, null);
            await newUser.save();
            res.status(201).json('Utilisateur créé');
        }
    }
});
router.post('/logout', async (req, res) => {
    if (req.context === null || req.context === undefined) {
        res.status(401).json('Utilisateur non connecté');
        return;
    }
    // get the token and remove it from the database
    let token = req.context.token;
    let tokenItem = await Token.getTokenByToken(token);
    await tokenItem?.delete();
    res.json('Utilisateur déconnecté').status(201); // TODO : return 404 if null

});


// router.get('/getALLToken', async (req, res) => {
//     const result = await Token.getAllToken();
//     res.status(201).json(result);
// });

// router.get('/create', async (req, res) => {
//     const result = await Token.createTable();
//     res.status(201).json(result);
// });