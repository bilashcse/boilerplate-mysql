import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { isCelebrate } from 'celebrate';

const routes = require('./controllers/index');
const configs = require('./configs/config');
const db = require('./models');
const { log } = require('./logger/index');
const { parseError, formatResponse } = require('./utils/celebrateErrorHandler');

function Server() {
  const self = this;
  const app = express();
  app.disable('x-powered-by');
  app.use(express.static(path.resolve(__dirname, '../public')));

  const corsOptions = {
    origin: configs.allowedOrigins,
    // credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use((err, req, res, next) => {
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

  this.defineModels = async () => {
    await db.sequelize.sync();
  };
  this.defineRoutes = () => {
    routes(app);
    app.options('*', (req, res) => {
      res.status(200).end();
    });
  };

  this.createDirectories = () => {
    const tempDir = `${__dirname}/temp`;
    if (!fs.existsSync(path.normalize(tempDir))) {
      fs.mkdirSync(tempDir);
    }
  };

  this.terminator = () => {
    this.appServer.close((err) => {
      if (err) {
        log.error(err);
        process.exit(1);
      }

      process.exit(0);
    });

    log.warn('Node app has stopped');
  };

  this.terminationHandlers = () => {
    process.on('exit', () => {
      self.terminator();
    });
  };

  this.start = () => {
    this.appServer = http.createServer(app).listen(configs.port, configs.ip);
    log.info(`Server started successfully. Port: ${configs.port}`);
  };
}

const server = new Server();
server.defineModels();
server.defineRoutes();
server.createDirectories();
server.start();
