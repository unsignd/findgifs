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
        ...gif,
        upvote: Object.keys(gif.upvote!)
          .filter(
            (ip) =>
              gif.upvote![ip] + 604800 >
              parseInt(new Date().getTime().toString().slice(0, -3))
          )
          .map((ip) => ({ [ip]: gif.upvote![ip] })),
      }))
      .sort(
        (a, b) =>
          (b.upvote ? Object.keys(b.upvote).length : 0) -
          (a.upvote ? Object.keys(a.upvote).length : 0)
      ),
  });
});

router.get('/load/unverified', async (req: Request, res: Response) => {
  const ip = req.ip ? req.ip.replaceAll('.', '') : undefined;

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
        ...gif,
        upvote: Object.keys(gif.upvote!)
          .filter(
            (key) =>
              gif.upvote![key] + 604800 >
              parseInt(new Date().getTime().toString().slice(0, -3))
          )
          .map((key) => ({ [key]: gif.upvote![key] })),

        isUpvoted: ip && gif.upvote && gif.upvote[ip] !== undefined,
      }))
      .sort(
        (a, b) =>
          (b.upvote ? Object.keys(b.upvote).length : 0) -
          (a.upvote ? Object.keys(a.upvote).length : 0)
      ),
  });
});

export { router as getRouter };
