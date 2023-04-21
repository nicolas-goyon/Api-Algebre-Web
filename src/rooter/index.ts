import express from 'express';
import { router as debugRouter } from '../controller/debug';

const router = express.Router();

router.use('/debug', debugRouter);

router.get('/', (req,res) => {
  res.json('404 : url non trouvée');
})


export default router;
