// src/server.js
import express, { json } from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';

const PORT = Number(getEnvVar('PORT', 3000));

const setupServer = () => {
  const app = express();

  app.use(cookieParser());
  
  app.use(cors());
  app.use(
    json({
      type: ['application/json', 'application.vnd.api+json'],
    }),
  );
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello',
    });
  });

  app.use(router);

  app.use('*', notFound);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
