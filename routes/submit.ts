import express, { Request, Response } from 'express';
import { Gif } from '../models/gif';

const router = express.Router();

router.post('/submit', async (req: Request, res: Response) => {
  const name = req.body.name;
  const url = req.body.url;
  const { width, height } = req.body.size;
  const ip = req.ip ? req.ip.replaceAll('.', '') : undefined;

  if (
    name === undefined ||
    url === undefined ||
    ip === undefined ||
    width === undefined ||
    height === undefined
  ) {
    res.status(400).send({
      error: 'Your request is invalid.',
    });

    return;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const oneHourAgo = currentTime - 3600;

  const documents = await Gif.aggregate(
    [
      {
        $match: {
          createdAt: { $gt: oneHourAgo },
        },
      },
      {
        $unwind: '$createdBy',
      },
      {
        $group: {
          _id: '$createdBy.ip',
          count: { $sum: 1 },
        },
      },
    ],
    { allowDiskUse: true }
  );

  if (documents.length > 0 && documents[0].count > 20) {
    res.status(429).send({
      error: 'Too many requests',
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
      size: {
        width,
        height,
      },
      createdAt: parseInt(new Date().getTime().toString().slice(0, -3)),
      createdBy: [
        {
          ip,
          date: parseInt(new Date().getTime().toString().slice(0, -3)),
        },
      ],
      upvote: [],
      isVerified: false,
    });
  } else if (
    document.createdAt! + 2592000 <=
      parseInt(new Date().getTime().toString().slice(0, -3)) &&
    (!document.isVerified ||
      document.upvote.filter(
        (upvote) =>
          (upvote.date ?? 0) + 604800 >
          parseInt(new Date().getTime().toString().slice(0, -3))
      ).length === 0)
  ) {
    await Gif.updateOne(
      { url },
      {
        name: [...document.name, name].sort(
          (a, b) => a.length - b.length || a.localeCompare(b)
        ),
        createdAt: parseInt(new Date().getTime().toString().slice(0, -3)),
        createdBy: [
          ...document.createdBy,
          {
            ip,
            date: parseInt(new Date().getTime().toString().slice(0, -3)),
          },
        ],
        isVerified: false,
      }
    );
  } else if (!document.name.includes(name)) {
    await Gif.updateOne(
      { url },
      {
        name: [...document.name, name].sort(
          (a, b) => a.length - b.length || a.localeCompare(b)
        ),
        createdBy: [
          ...document.createdBy,
          {
            ip,
            date: parseInt(new Date().getTime().toString().slice(0, -3)),
          },
        ],
      }
    );
  }

  res.send();
});

export { router as submitRouter };
