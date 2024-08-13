import express, { Request, Response } from 'express';
import { Gif } from '../models/gif';

const router = express.Router();

router.put('/update', async (req: Request, res: Response) => {
  const url = req.body.url;
  const ip = req.ip ? req.ip.replaceAll('.', '') : undefined;

  if (url === undefined || ip === undefined) {
    res.status(400).send({
      error: 'Your request is invalid.',
    });

    return;
  }

  const document = await Gif.findOne({
    url,
  });

  if (document === null) {
    res.status(404).send({
      error: 'Fail to find the GIF.',
    });

    return;
  }

  const upvotes = document!.upvote?.filter((upvote) => upvote.ip === ip);

  const currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
  const cooldownPeriod = 604800; // 7 days in seconds

  if (
    ip &&
    (upvotes.length === 0 ||
      (upvotes[upvotes.length - 1].date ?? 0) + cooldownPeriod <= currentTime)
  ) {
    document!.upvote.push({
      ip,
      date: currentTime,
    });
  } else if (
    ip &&
    !document.isVerified &&
    upvotes.length !== 0 &&
    (upvotes[upvotes.length - 1].date ?? 0) + cooldownPeriod > currentTime
  ) {
    // Delete the last upvote from the same IP
    const lastUpvoteIndex = document!.upvote.findIndex(
      (upvote) =>
        upvote.ip === ip && upvote.date === upvotes[upvotes.length - 1].date
    );
    if (lastUpvoteIndex !== -1) {
      document!.upvote.splice(lastUpvoteIndex, 1);
    }
  }

  await document!.save();

  res.send();
});

export { router as updateRouter };
