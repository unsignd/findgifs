import express, { Request, Response } from 'express';
import { Gif } from '../models/gif';

const router = express.Router();

router.post('/submit', async (req: Request, res: Response) => {
  const name = req.body.name;
  const url = req.body.url;
  const ip = req.ip ? req.ip.replaceAll('.', '') : undefined;

  if (name === undefined || url === undefined || ip === undefined) {
    res.status(400).send({
      error: 'Your request is invalid.',
    });

    return;
  }

  const document = await Gif.findOne({
    url,
  });

  if (!document) {
    await Gif.create({
      name: [name],
      url,
      createdAt: parseInt(new Date().getTime().toString().slice(0, -3)),
      createdBy: [ip],
      upvote: [],
      isVerified: false,
    });
  } else if (!document.name.includes(name)) {
    await Gif.updateOne(
      { url },
      {
        name: [...document.name, name].sort(
          (a, b) => a.length - b.length || a.localeCompare(b)
        ),
        createdBy: document.createdBy.includes(ip)
          ? document.createdBy
          : [...document.createdBy, ip],
      }
    );
  }

  res.send();
});

export { router as submitRouter };
