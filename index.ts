import dotenv from 'dotenv';
import express, { Response, Application } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { seaerchRouter } from './routes/search';
import { connect } from './configs/database';
import { submitRouter } from './routes/submit';
import { getRouter } from './routes/load';
import { updateRouter } from './routes/update';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

const allowedOrigins = [process.env.URL || 'http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Your request is not allowed by CORS.'));
    }
  },
};

connect();

app.set('trust proxy', true);

app.use(cors(corsOptions));
app.use(json());
app.use(seaerchRouter);
app.use(submitRouter);
app.use(getRouter);
app.use(updateRouter);

app.get('/', (_, res: Response) => {
  res.send('Welcome to the FindGIFs API!');
});

app.listen(port, () => {
  console.log(`Server is live at http://localhost:${port}`);
});
