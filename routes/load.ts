import express, { Request, Response } from 'express';
import { Gif } from '../models/gif';

const router = express.Router();

router.get('/load/verified', async (req: Request, res: Response) => {
  const skip = parseInt(req.query.skip as string);

  if (Number.isNaN(skip)) {
    res.status(400).send({
      error: 'Your request is invalid.',
    });

    return;
  }

  const documents = await Gif.find({
    isVerified: true,
  })
    .skip(skip)
    .limit(30)
    .lean();

  if (documents === null) {
    res.status(404).send({
      error: 'Fail to load GIFs.',
    });

    return;
  }

  res.send({
    data: documents
      .filter(
        (document) =>
          document.createdAt! + 2592000 >
            parseInt(new Date().getTime().toString().slice(0, -3)) ||
          document.upvote.filter(
            (upvote) =>
              (upvote.date ?? 0) + 604800 >
              parseInt(new Date().getTime().toString().slice(0, -3))
          ).length !== 0
      )
      .map((document) => ({
        name: document.name,
        url: document.url,
        upvote: document.upvote.filter(
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
  const skip = parseInt(req.query.skip as string);

  console.log(skip);

  if (ip === undefined || Number.isNaN(skip)) {
    res.status(400).send({
      error: 'Your request is invalid.',
    });

    return;
  }

  const documents = await Gif.find({
    isVerified: false,
  })
    .skip(skip)
    .limit(30)
    .lean();

  if (documents === null) {
    res.status(404).send({
      error: 'Fail to load GIFs.',
    });

    return;
  }

  res.send({
    data: documents
      .filter(
        (document) =>
          document.createdAt! + 2592000 >
          parseInt(new Date().getTime().toString().slice(0, -3))
      )
      .map((document) => ({
        name: document.name,
        url: document.url,
        upvote: document.upvote.filter(
          (upvote) =>
            (upvote.date ?? 0) + 604800 >
            parseInt(new Date().getTime().toString().slice(0, -3))
        ).length,
        isUpvoted:
          document.upvote.filter(
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
