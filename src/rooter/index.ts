import express from 'express';
import { TestTableRouter, UtilisateurRouter, Authenticator, Workspace } from '../controller';

const router = express.Router();

router.use('/debug', TestTableRouter);
router.use('/users', UtilisateurRouter);
router.use('/auth', Authenticator);
router.use('/workspace', Workspace);

router.get('/', (req,res) => {
  res.json('404 : url non trouvée');
})


export default router;
