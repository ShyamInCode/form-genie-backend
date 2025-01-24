import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Ok');
});

router.get('/health', (req: Request, res: Response) => {
  res.send('I am fine. Thanks!');
});

export default router;
