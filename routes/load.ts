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

  const documents = await Gif.aggregate([
    { $match: { isVerified: true } },
    { $unwind: { path: '$upvote', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        url: { $first: '$url' },
        size: { $first: '$size' },
        upvote: {
          $sum: {
            $add: [
              0.5, // Default value
              { $divide: [0.5, { $subtract: [currentTime, '$upvote.date'] }] }, // 0.5 / time
            ],
          },
        },
        isNSFW: { $first: '$isNSFW' },
      },
    },
    { $sort: { upvote: -1, name: 1 } }, // Sort by score (upvote) and name
  ])
    .skip(skip)
    .limit(20);

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
      size: {
        width: document.size.width,
        height: document.size.height,
      },
      upvote: document.count,
      isNSFW: document.isNSFW,
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

  await new Promise((resolve) => setTimeout(resolve, 1200));

  const currentTime = Math.floor(Date.now() / 1000);
  const oneMonthAgo = currentTime - 2592000;
  const oneWeekAgo = currentTime - 604800;

  const documents = await Gif.aggregate([
    {
      $match: {
        isVerified: false,
        $or: [
          { createdAt: { $gt: oneMonthAgo } },
          { 'upvote.date': { $gt: oneWeekAgo } },
        ],
      },
    },
    {
      $addFields: {
        upvote: {
          $filter: {
            input: '$upvote',
            as: 'upvote',
            cond: { $gt: ['$$upvote.date', oneWeekAgo] },
          },
        },
      },
    },
    { $unwind: { path: '$upvote', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        url: { $first: '$url' },
        size: { $first: '$size' },
        upvote: { $push: '$upvote.ip' },
      },
    },
    {
      $project: {
        name: 1,
        url: 1,
        size: 1,
        upvote: 1,
        count: { $size: '$upvote' },
      },
    },
    { $sort: { count: -1, name: 1 } },
  ])
    .skip(skip)
    .limit(20);

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
      size: {
        width: document.size.width,
        height: document.size.height,
      },
      upvote: document.count,
      isUpvoted: isUpvoted,
    };
  });

  res.send({
    data: filteredData,
  });
});

export { router as getRouter };
