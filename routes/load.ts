import express, { Request, Response } from 'express';
import { Gif } from '../models/gif';

const router = express.Router();

router.get('/load/verified', async (_: Request, res: Response) => {
  const documents = await Gif.find({
    isVerified: true,
  }).lean();

  if (documents === null) {
    res.status(404).send({
      error: 'Fail to load GIFs.',
    });

    return;
  }

  res.send({
    data: documents
      .filter(
        (gif) =>
          gif.createdAt! + 2592000 >
          parseInt(new Date().getTime().toString().slice(0, -3))
      )
      .map((gif) => ({
        name: gif.name,
        url: gif.url,
        upvote: gif.upvote.filter(
          (upvote) =>
            (upvote.date ?? 0) + 604800 >
            parseInt(new Date().getTime().toString().slice(0, -3))
        ).length,
      }))
      .sort((a, b) => b.upvote - a.upvote),
  });
});

router.get('/load/unverified', async (req: Request, res: Response) => {
  const ip = req.ip ? req.ip.replaceAll('.', '') : undefined;

  if (ip === undefined) {
    res.status(400).send({
      error: 'Your request is invalid.',
    });

    return;
  }

  const documents = await Gif.find({
    isVerified: false,
  }).lean();

  if (documents === null) {
    res.status(404).send({
      error: 'Fail to load GIFs.',
    });

    return;
  }

  res.send({
    data: documents
      .filter(
        (gif) =>
          gif.createdAt! + 2592000 >
          parseInt(new Date().getTime().toString().slice(0, -3))
      )
      .map((gif) => ({
        name: gif.name,
        url: gif.url,
        upvote: gif.upvote.filter(
          (upvote) =>
            (upvote.date ?? 0) + 604800 >
            parseInt(new Date().getTime().toString().slice(0, -3))
        ).length,
        isUpvoted:
          gif.upvote.filter(
            (upvote) =>
              (upvote.date ?? 0) + 604800 >
                parseInt(new Date().getTime().toString().slice(0, -3)) &&
              upvote.ip === ip
          ).length !== 0,
      }))
      .sort((a, b) => b.upvote - a.upvote),
  });
});

export { router as getRouter };
