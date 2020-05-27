import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { isCelebrate } from 'celebrate';

import { parseError, formatResponse } from './utils/celebrateErrorHandler';
import routes from './controllers/index';
import configs from './configs/config';
import db from './models';
import { log } from './logger/index';

class Server {
  constructor(port, ip, app) {
    this.port = port;
    this.ip = ip;
    this.app = app;
  }

  defineMiddleware() {
    this.app.disable('x-powered-by');
    this.app.use(express.static(path.resolve(__dirname, '../public')));

    const corsOptions = {
      origin: configs.allowedOrigins,
      // credentials: true,
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
      optionsSuccessStatus: 200,
    };

    this.app.use(cors(corsOptions));
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.app.use((err, req, res, next) => {
      if (isCelebrate(err)) {
        const errors = parseError(err);

        // build main error message
        const errorMessage = errors.map((e) => e.message).join(', ');

        // retrieve validation failure source
        // eslint-disable-next-line no-underscore-dangle
        const { source } = err._meta;

        // format error response
        // eslint-disable-next-line no-param-reassign
        err = formatResponse(err, source, errorMessage, errors);

        const error = {
          isError: true,
          statusCode: 400,
          error: 'Bad Request',
          message: err.output.payload.message,
          validation: err.output.payload.validation,
        };

        return res.status(400).send(error);
      }

      // If this isn't a Celebrate error, send it to the next error handler
      return next(err);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async defineModels() {
    await db.sequelize.sync();
  }

  defineRoutes() {
    routes(this.app);
    this.app.options('*', (req, res) => {
      res.status(200).end();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  createDirectories() {
    const tempDir = path.join(__dirname, '/temp');
    if (!fs.existsSync(path.join(tempDir))) {
      fs.mkdirSync(tempDir);
    }
  }

  start() {
    this.appServer = http.createServer(this.app).listen(this.port, this.ip);
    log.info(`Server started successfully. Port: ${this.port}`);
  }
}

const server = new Server(configs.port, configs.ip, express());
server.defineMiddleware();
server.defineModels();
server.defineRoutes();
server.createDirectories();
server.start();
