import express from 'express';
import { Relation } from '../models';
import { db } from '../rooter/database';
export const router = express.Router();
// Route : /relation
/* -------------------------------------------------------------------------- */
/*                                   ROUTER                                   */
/* -------------------------------------------------------------------------- */

router.get('/getAll', async (req, res) => {
    let relations = await Relation.getAll();
    let result : any[] = [];
    relations.forEach(relation => {
        result.push({id_interface : relation.id_interface, name : relation.name, content : relation.content});
    });
    res.json({relations : result}); // TODO : handle null
});



router.get('/getAllById/:id', async (req, res) => {
    let relations = await Relation.getAllByInterface(Number(req.params.id));
    let result : any[] = [];
    relations.forEach(relation => {
        result.push({id_interface : relation.id_interface, name : relation.name, content : relation.content});
    });
    res.json({relations : result}); // TODO : handle null
});

router.get('/get/:id/:name', async (req, res) => {
    let relation = await Relation.get(Number(req.params.id), req.params.name);
    if(relation === null){
        res.status(404).json('Relation non trouvée');
        return;
    }
    let result = {id_interface : relation.id_interface, name : relation.name, content : relation.content};
    res.json({relation : result}); 
});

router.post('/changeContent' , async (req, res) => {
    let relation = await Relation.get(Number(req.body.id), req.body.name);
    if(relation === null){
        res.status(404).json('Relation non trouvée');
        return;
    }
    relation.content = req.body.content;
    await relation.save();
    let result = {id_interface : relation.id_interface, name : relation.name, content : relation.content};
    res.json({relation : result}); 
});

router.post('/create', async (req, res) => {
    let relation = await Relation.get(Number(req.body.id), req.body.name);
    if(relation !== null){
        res.status(404).json('Relation déjà existante');
        return;
    }
    relation = new Relation(Number(req.body.id), req.body.name, req.body.content);
    await relation.save();
    let result = {id_interface : relation.id_interface, name : relation.name, content : relation.content};
    res.json({relation : result}); 
});

router.post('/save', async (req, res) => {
    if (req.body.id === undefined || req.body.name === undefined || req.body.content === undefined) {
        console.log("Paramètre manquant : id, name ou content");
        res.status(400).json('Paramètre manquant : id, name ou content');
        return;
    }


    let relation = await Relation.get(Number(req.body.id), req.body.name);
    if(relation === null){
        // Create
        console.log("Création de la relation");
        relation = new Relation(Number(req.body.id), req.body.name, req.body.content);
    }
    relation.content = req.body.content;
    await relation.save();
    console.log("Relation sauvegardée");
    let result = {id_interface : relation.id_interface, name : relation.name, content : relation.content};
    res.json({relation : result}); 
});

router.post('/changeName', async (req, res) => {
    const relation = await Relation.get(Number(req.body.id), req.body.name);
    if(relation === null){
        res.status(404).json('Relation non trouvée');
        return;
    }
    relation.changeName(req.body.newName);
    await relation.save();
    let result = {id_interface : relation.id_interface, name : relation.name, content : relation.content};
    res.json({relation : result}); 
});