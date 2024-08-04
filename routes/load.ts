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
  const oneMonthAgo = currentTime - 2592000;
  const oneWeekAgo = currentTime - 604800;

  const documents = await Gif.find({
    isVerified: true,
    $or: [
      { createdAt: { $gt: oneMonthAgo } },
      { 'upvote.date': { $gt: oneWeekAgo } },
    ],
  })
    .skip(skip)
    .limit(30)
    .lean();

  if (!documents || documents.length === 0) {
    res.status(404).send({
      error: 'Fail to load GIFs.',
    });
    return;
  }

  const filteredData = documents.map((document) => {
    const recentUpvotes = document.upvote.filter(
      (upvote) => (upvote.date ?? 0) > oneWeekAgo
    );

    return {
      name: document.name,
      url: document.url,
      upvote: recentUpvotes.length,
    };
  });

  filteredData.sort((a, b) => b.upvote - a.upvote);

  res.send({
    data: filteredData,
    size: filteredData.length,
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

  const documents = await Gif.find({
    isVerified: false,
    createdAt: { $gt: oneMonthAgo },
  })
    .skip(skip)
    .limit(30)
    .lean();

  if (!documents || documents.length === 0) {
    res.status(404).send({
      error: 'Fail to load GIFs.',
    });
    return;
  }

  const filteredData = documents.map((document) => {
    const recentUpvotes = document.upvote.filter(
      (upvote) => (upvote.date ?? 0) > oneWeekAgo
    );
    const isUpvoted = recentUpvotes.some((upvote) => upvote.ip === ip);

    return {
      name: document.name,
      url: document.url,
      upvote: recentUpvotes.length,
      isUpvoted: isUpvoted,
    };
  });

  filteredData.sort((a, b) => b.upvote - a.upvote);

  const totalSize = await Gif.countDocuments({
    isVerified: false,
    createdAt: { $gt: oneMonthAgo },
  });

  res.send({
    data: filteredData,
    size: totalSize,
  });
});

export { router as getRouter };
