import express from 'express';
import { getShema } from './database';
import { testBuilder } from '../controller/debug';

const router = express.Router();

router.get('/debug/get', async (req, res) => {
  const users = await getShema();
  res.json(users);
  // res.json(['😀', '😳', '🙄']);

});


router.get('/debug/set', async (req, res) => {
  const users = await testBuilder()
  res.json(users);
  // res.json(['😀', '😳', '🙄']);

});

router.get('/', (req,res) => {
  res.json('404 : url non trouvée');
})


export default router;
