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

  const currentTime = Math.floor(Date.now() / 1000);
  const oneWeekAgo = currentTime - 604800;

  const documents = await Gif.aggregate([
    { $match: { isVerified: false } },
    { $unwind: '$upvote' },
    { $match: { 'upvote.date': { $gt: oneWeekAgo } } },
    {
      $project: {
        name: 1,
        url: 1,
        upvote: { $sum: 1 },
        count: { $size: '$upvote' },
      },
    },
    { $sort: { count: -1 } },
  ])
    .skip(skip)
    .limit(30);

  if (!documents || documents.length === 0) {
    res.status(404).send({
      error: 'Fail to load GIFs.',
    });

    return;
  }

  const filteredData = documents.map((document) => {
    const recentUpvotes = document.upvote.filter(
      (upvote: { ip: string; date: number }) => (upvote.date ?? 0) > oneWeekAgo
    );

    return {
      name: document.name,
      url: document.url,
      upvote: recentUpvotes.length,
    };
  });

  res.send({
    data: filteredData,
  });
});

router.get('/load/unverified', async (req: Request, res: Response) => {
  const ip = req.ip ? req.ip.replaceAll('.', '') : undefined;
  const skip = parseInt(req.query.skip as string);

  if (ip === undefined || Number.isNaN(skip)) {
    res.status(400).send({
      error: 'Your request is invalid.',
    });

    return;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const oneMonthAgo = currentTime - 2592000;
  const oneWeekAgo = currentTime - 604800;

  const documents = await Gif.aggregate([
    { $match: { isVerified: false, createdAt: { $gt: oneMonthAgo } } },
    {
      $project: {
        upvote: 1,
        name: 1,
        url: 1,
        count: { $size: '$upvote' },
      },
    },
    { $sort: { count: -1 } },
  ])
    .skip(skip)
    .limit(30);

  if (!documents || documents.length === 0) {
    res.status(404).send({
      error: 'Fail to load GIFs.',
    });

    return;
  }

  const filteredData = documents.map((document) => {
    const recentUpvotes = document.upvote.filter(
      (upvote: { ip: string; date: number }) => (upvote.date ?? 0) > oneWeekAgo
    );
    const isUpvoted = recentUpvotes.some(
      (upvote: { ip: string; date: number }) => upvote.ip === ip
    );

    return {
      name: document.name,
      url: document.url,
      upvote: recentUpvotes.length,
      isUpvoted: isUpvoted,
    };
  });

  res.send({
    data: filteredData,
  });
});

export { router as getRouter };
