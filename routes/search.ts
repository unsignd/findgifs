import axios from 'axios';
import express, { Request, Response } from 'express';

const router = express.Router();

let apiKeyIndex = 0;

router.get('/search', async (req: Request, res: Response) => {
  const query = req.query.query as string;
  const apiKeyList = process.env.KEY_GIPHY;

  if (query === undefined || query.length > 50) {
    res.status(400).send({
      error: 'Your request is invalid.',
    });

    return;
  }

  if (!apiKeyList) {
    res.status(500).send({
      error: 'API key not provided.',
    });
    return;
  }

  for (let i = 0; i < apiKeyList.split(', ').length; i++) {
    try {
      let response = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: {
          q: query,
          limit: 10,
          api_key: apiKeyList.split(', ')[apiKeyIndex],
        },
      });

      let gifs = response.data.data
        .map((gif: any) => {
          let url = gif.images.downsized_medium.url;
          let width = gif.images.downsized_medium.width;
          let height = gif.images.downsized_medium.height;

          if (url && width && height) {
            return {
              url:
                url.slice(0, 8) +
                'media.' +
                url.slice(url.indexOf('giphy.com'), url.indexOf('?cid=')),
              size: {
                width,
                height,
              },
            };
          } else {
            return undefined;
          }
        })
        .filter((gif: any) => gif);

      res.send({
        data: gifs,
      });

      break;
    } catch (error) {
      if (i === apiKeyList.split(', ').length - 1) {
        console.error('Fail to search GIFs: ', error);

        res.status(500).send({
          error: 'Fail to search GIFs.',
        });
      }
    }

    if (apiKeyIndex < apiKeyList.split(', ').length - 1) {
      apiKeyIndex += 1;
    } else {
      apiKeyIndex = 0;
    }
  }
});

export { router as seaerchRouter };
