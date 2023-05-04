import express from 'express';
import { Workspace } from '../models';
export const router = express.Router();

router.get('/load/:id?', async (req, res) => {
    if (req.context === null || req.context === undefined) {
        res.status(401).json('Utilisateur non connecté');
        return;
    }
    let id_user = req.context.id;
    let id = Number(req.params.id);

    if (id === null || id === undefined) {
        let workspaces = await Workspace.getWorkspacesByIdUser(id_user);
        if (workspaces.length === 0) {
            res.json(null).status(201);
            return;
        }
        res.json({workspace : workspaces[0].workspace_content}).status(201);
    }
    else {
        let workspace = await Workspace.getWorkspaceByUserIdAndId(id_user, id);
        if (workspace === null || workspace === undefined) {
            res.status(401).json('Workspace non trouvé');
            return;
        }
        res.json({workspace : workspace.workspace_content}).status(201);
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

    if (req.body.workspaceId === null || req.body.workspaceId === undefined) {
        let newWorkspace = new Workspace(null, id_user, workspace_content);
        await newWorkspace.save();
        res.json({id: newWorkspace.id}).status(201);
    } else {
        let workspaceToUpdate = await Workspace.getWorkspaceByUserIdAndId(id_user, req.body.workspaceId);

        if (workspaceToUpdate === null || workspaceToUpdate === undefined) {
            res.status(401).json('Workspace non trouvé');
            return;
        }

        workspaceToUpdate.workspace_content = workspace_content;
        await workspaceToUpdate.save();
        res.json({id: workspaceToUpdate.id}).status(201);
    }
});

router.get('/all', async (req, res) => {
    if (req.context === null || req.context === undefined) {
        res.status(401).json('Utilisateur non connecté');
        return;
    }
    let id_user = req.context.id;
    let workspace = await Workspace.getWorkspacesByIdUser(id_user);
    let data = [];
    data = workspace.map((workspace) => {
        return {
            id: workspace.id,
            title : "Workspace " + workspace.id,
            workspace_content: workspace.workspace_content
        }
    });
    res.json(data).status(201);
});


router.get('/getAll', async (req, res) => {
    let workspaces = await Workspace.findAll();
    res.json(workspaces).status(201);
});

router.get('/createTable', async (req, res) => {
    await Workspace.createTable();
    res.json('Table créée').status(201);
});