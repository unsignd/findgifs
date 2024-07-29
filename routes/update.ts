import express, { Request, Response } from 'express';
import { Gif } from '../models/gif';

const router = express.Router();

router.put('/update/upvote', async (req: Request, res: Response) => {
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

  if (
    ip &&
    (upvotes.length === 0 ||
      (upvotes[upvotes.length - 1].date ?? 0) + 604800 <=
        parseInt(new Date().getTime().toString().slice(0, -3)))
  ) {
    document!.upvote.push({
      ip,
      date: parseInt(new Date().getTime().toString().slice(0, -3)),
    });
  }

  await document!.save();

  res.send();
});

export { router as updateRouter };
