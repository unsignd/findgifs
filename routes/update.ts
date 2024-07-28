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

  if (
    ip &&
    (document!.upvote?.get(ip) === undefined ||
      document!.upvote.get(ip)! + 604800 <=
        parseInt(new Date().getTime().toString().slice(0, -3)))
  ) {
    document!.upvote?.set(
      ip,
      parseInt(new Date().getTime().toString().slice(0, -3))
    );
  }

  await document!.save();

  res.send({
    data: await Gif.findOne({
      url,
    }),
  });
});

export { router as updateRouter };
