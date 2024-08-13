import express, { Request, Response } from 'express';
import { Gif } from '../models/gif';

const router = express.Router();

router.get('/size', async (_: Request, res: Response) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const oneMonthAgo = currentTime - 2592000;
  const oneWeekAgo = currentTime - 604800;

  const documents = await Gif.find({
    $or: [
      {
        isVerified: true,
      },
      {
        isVerified: false,
        $or: [
          { createdAt: { $gt: oneMonthAgo } },
          { 'upvote.date': { $gt: oneWeekAgo } },
        ],
      },
    ],
  }).lean();

  if (!documents || documents.length === 0) {
    res.send({
      data: 0,
    });

    return;
  }

  res.send({
    data: documents.length,
  });
});

router.get('/size/verified', async (_: Request, res: Response) => {
  const documents = await Gif.find({
    isVerified: true,
  }).lean();

  if (!documents || documents.length === 0) {
    res.send({
      data: 0,
    });

    return;
  }

  res.send({
    data: documents.length,
  });
});

router.get('/size/unverified', async (_: Request, res: Response) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const oneMonthAgo = currentTime - 2592000;
  const oneWeekAgo = currentTime - 604800;

  const documents = await Gif.find({
    isVerified: false,
    $or: [
      { createdAt: { $gt: oneMonthAgo } },
      { 'upvote.date': { $gt: oneWeekAgo } },
    ],
  }).lean();

  console.log(documents.length);

  if (!documents || documents.length === 0) {
    res.send({
      data: 0,
    });

    return;
  }

  res.send({
    data: documents.length,
  });
});

export { router as sizeRouther };
