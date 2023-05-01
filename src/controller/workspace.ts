import express from 'express';
import { Workspace } from '../models';
export const router = express.Router();

router.get('/load', async (req, res) => {
    if (req.context === null || req.context === undefined) {
        res.status(401).json('Utilisateur non connecté');
        return;
    }
    let id_user = req.context.id;
    let workspaces = await Workspace.getWorkspacesByIdUser(id_user);
    if (workspaces.length === 0) {
        res.json(null).status(201);
    }
    else {
        res.json({workspace : workspaces[0].workspace_content}).status(201);
    }
});

router.post('/save', async (req, res) => {
    if (req.context === null || req.context === undefined) {
        res.status(401).json('Utilisateur non connecté');
        return;
    }
    let id_user = req.context.id;
    let workspace_content = req.body.workspace;
    let workspace = await Workspace.getWorkspacesByIdUser(id_user);

    if (workspace.length === 0) {
        let newWorkspace = new Workspace(null, id_user, workspace_content);
        await newWorkspace.save();
        res.json('Workspace créé').status(201);
    } else {
        let workspaceToUpdate = workspace[0];
        workspaceToUpdate.workspace_content = workspace_content;
        await workspaceToUpdate.save();
        res.json('Workspace mis à jour').status(201);
    }
});

router.get('/all', async (req, res) => {
    if (req.context === null || req.context === undefined) {
        res.status(401).json('Utilisateur non connecté');
        return;
    }
    let id_user = req.context.id;
    let workspace = await Workspace.getWorkspacesByIdUser(id_user);
    res.json(workspace).status(201);
});


// router.get('/getAll', async (req, res) => {
//     let workspaces = await Workspace.getAllWorkspaces();
//     res.json(workspaces).status(201);
// });

router.get('/createTable', async (req, res) => {
    await Workspace.createTable();
    res.json('Table créée').status(201);
});