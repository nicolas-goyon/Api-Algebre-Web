import express from 'express';
import { Exercice, Relation } from '../models';
export const router = express.Router();

router.get('/', async (req, res) => {
    // Pas besoin de vérifier si l'utilisateur est connecté
    const exercices = await Exercice.getAllExercices();
    if (exercices.length === 0) {
        res.json(null).status(201);
        return;
    }
    const data = exercices.map((exercice) => {
        return {
            id: exercice.id,
            name: exercice.name,
            enonce: exercice.enonce,
        };
    });
    res.json({ exercices: data }).status(201);
});


router.get('/:id', async (req, res) => {
    // Pas besoin de vérifier si l'utilisateur est connecté
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(401).json('Id invalide');
        return;
    }
    const exercice = await Exercice.getExerciceById(id);
    if (exercice === null || exercice === undefined) {
        res.status(401).json('Exercice non trouvé');
        return;
    }
    const relations = await Relation.getAllByInterface(exercice.id);
    const data = {
        id: exercice.id,
        name: exercice.name,
        enonce: exercice.enonce,
        relations: relations.map((relation) => {
            return {
                id: relation.id_interface,
                name: relation.name,
                content: relation.content,
            };
        }),
    };
    res.json({ exercice : data }).status(201);
});

router.post('/', async (req, res) => {
    if (req.context === null || req.context === undefined) {
        res.status(401).json('Utilisateur non connecté');
        return;
    }
    const id_user = req.context.id;
    const name = req.body.name;
    const enonce = req.body.description;
    const exercice = await Exercice.create(id_user, name, enonce);
    console.info(exercice)
    console.info(req.body.relations)
    for (const relationRaw of req.body.relations) {
        const relation = new Relation(exercice.id, relationRaw.name, relationRaw.content);
        let res = await relation.save();
        console.log(relation)
        console.log(res);
    }
    // res.json({ id: null }).status(201);
    res.json({ id: exercice.id }).status(201);
});

router.delete('/:id', async (req, res) => {
    if (req.context === null || req.context === undefined) {
        res.status(401).json('Utilisateur non connecté');
        return;
    }
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(401).json('Id invalide');
        return;
    }
    const exercice = await Exercice.getExerciceById(id);
    if (exercice === null || exercice === undefined) {
        res.status(401).json('Exercice non trouvé');
        return;
    }
    if (exercice.id_user !== req.context.id) {
        res.status(401).json('Vous ne pouvez pas supprimer cet exercice');
        return;
    }
    // const relations = await Relation.getAllByInterface(exercice.id);
    // for (const relation of relations) {
    //     await relation.delete();
    // }
    await exercice.delete();
    res.json({ id: exercice.id }).status(201);
});