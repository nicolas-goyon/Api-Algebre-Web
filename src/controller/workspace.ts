import express from 'express';
import { Workspace } from '../models';
export const router = express.Router();

router.get('/:id?', async (req, res) => {
    if (req.context === null || req.context === undefined) {
        res.status(401).json('Utilisateur non connecté');
        return;
    }
    let id_user = req.context.id;
    let id = Number(req.params.id);

    if (id === null || id === undefined || isNaN(id)) { // get all workspaces
        let workspaces = await Workspace.getWorkspacesByIdUser(id_user);
        if (workspaces.length === 0) {
            res.json(null).status(201);
            return;
        }
        let data = [];
        data = workspaces.map((workspace) => {
            return {
                id: workspace.id,
                title : workspace.name,
                workspace_content: workspace.workspace_content
            }
        });
        res.json({workspace : data}).status(201);
    }
    else { // get one workspace
        console.log('id_user : ' + id_user);
        console.log('id : ' + id);
        let workspace = await Workspace.getWorkspaceByUserIdAndId(id_user, id);
        if (workspace === null || workspace === undefined) {
            res.status(401).json('Workspace non trouvé');
            return;
        }
        res.json({workspace : workspace.workspace_content}).status(201);
    }



});

async function save(req: express.Request, res: express.Response) {
    if (req.context === null || req.context === undefined) {
        res.status(401).json('Utilisateur non connecté');
        return;
    }
    let id_user = req.context.id;
    let workspace_content = req.body.workspace;
    let name = req.body.name;
    let workspace;
    if (req.body.workspaceId === null || req.body.workspaceId === undefined) {
        workspace = new Workspace(null, id_user, workspace_content,  name);
    } else {
        workspace = await Workspace.getWorkspaceByUserIdAndId(id_user, req.body.workspaceId);
        if (workspace === null || workspace === undefined) {
            res.status(401).json('Workspace non trouvé');
            return;
        }
        workspace.workspace_content = workspace_content;
        workspace.name = name;
    }
    await workspace.save();
    res.json({id: workspace.id}).status(201);
}

router.patch('/', save);
router.post('/', save);

// router.get('/getAll', async (req, res) => {
//     let workspaces = await Workspace.findAll();
//     res.json(workspaces).status(201);
// });

// router.get('/createTable', async (req, res) => {
//     await Workspace.createTable();
//     res.json('Table créée').status(201);
// });