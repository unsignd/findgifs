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
    { $match: { isVerified: true } },
    { $unwind: { path: '$upvote', preserveNullAndEmptyArrays: true } },
    {
      $match: {
        $or: [
          { upvote: { $exists: false } },
          {
            'upvote.date': { $gt: oneWeekAgo },
          },
        ],
      },
    },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        url: { $first: '$url' },
        upvote: { $push: '$upvote.ip' },
      },
    },
    {
      $project: {
        name: 1,
        url: 1,
        upvote: 1,
        count: { $size: '$upvote' },
      },
    },
    { $sort: { count: -1, name: 1 } },
  ])
    .skip(skip)
    .limit(10);

  if (!documents || documents.length === 0) {
    res.status(404).send({
      error: 'Fail to load GIFs.',
    });

    return;
  }

  const filteredData = documents.map((document) => {
    return {
      name: document.name,
      url: document.url,
      upvote: document.count,
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
    {
      $match: {
        isVerified: false,
        $or: [
          {
            createdAt: { $gt: oneMonthAgo },
          },
          { 'upvote.date': { $gt: oneWeekAgo } },
        ],
      },
    },
    { $unwind: { path: '$upvote', preserveNullAndEmptyArrays: true } },
    {
      $match: {
        $or: [
          { upvote: { $exists: false } },
          {
            'upvote.date': { $gt: oneWeekAgo },
          },
        ],
      },
    },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        url: { $first: '$url' },
        upvote: { $push: '$upvote.ip' },
      },
    },
    {
      $project: {
        name: 1,
        url: 1,
        upvote: 1,
        count: { $size: '$upvote' },
      },
    },
    { $sort: { count: -1, name: 1 } },
  ])
    .skip(skip)
    .limit(10);

  if (!documents || documents.length === 0) {
    res.status(404).send({
      error: 'Fail to load GIFs.',
    });

    return;
  }

  const filteredData = documents.map((document) => {
    const isUpvoted = document.upvote.some(
      (upvoteIp: string) => upvoteIp === ip
    );

    return {
      name: document.name,
      url: document.url,
      upvote: document.count,
      isUpvoted: isUpvoted,
    };
  });

  res.send({
    data: filteredData,
  });
});

export { router as getRouter };
