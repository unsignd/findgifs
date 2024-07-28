import axios from 'axios';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/search', async (req: Request, res: Response) => {
  const query = req.query.query as string;
  const apiKey = process.env.KEY_GIPHY;

  if (query === undefined || query.length > 50) {
    res.status(400).send({
      error: 'Your request is invalid.',
    });

    return;
  }

  if (!apiKey) {
    res.status(500).send({
      error: 'API key not provided.',
    });
    return;
  }

  try {
    let response = await axios.get('https://api.giphy.com/v1/gifs/search', {
      params: {
        q: query,
        limit: 5,
        api_key: apiKey,
      },
    });

    let gifs = response.data.data.map((gif: any) => {
      let url = gif.images.downsized_medium.url;

      return (
        url.slice(0, 8) +
        'media.' +
        url.slice(url.indexOf('giphy.com'), url.indexOf('?cid='))
      );
    });

    res.send({
      data: gifs,
    });
  } catch (error) {
    console.error('Fail to search GIFs: ', error);

    res.status(500).send({
      error: 'Fail to search GIFs.',
    });
  }
});

export { router as seaerchRouter };
