import express from 'express';
import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import { getShema } from '../rooter/database';

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await getShema();
  res.json(users);
});

router.use('/emojis', emojis);

export default router;
