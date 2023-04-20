import express from 'express';
import { getShema } from './database';

const router = express.Router();

router.get('/debug', async (req, res) => {
  const users = await getShema();
  res.json(users);
});


export default router;
