import http from 'http';
import express from 'express';
import 'reflect-metadata';

import './config/logging';
import { loggingHandler } from './middleware/loggingHandler';
import { corsHandler } from './middleware/corsHandler';
import { routeNotFound } from './middleware/routeNotFound';
import { SERVER_HOST, SERVER_PORT } from './config/config';
import { defineRoutes } from './modules/routes';
import MainController from './controllers/main';

export const app = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = () => {
    logging.info('--------------------------------------------');
    logging.info('Initializing API');
    logging.info('--------------------------------------------');

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    logging.info('--------------------------------------------');
    logging.info('Logging & Configuration');
    logging.info('--------------------------------------------');

    app.use(loggingHandler);
    app.use(corsHandler);

    logging.info('--------------------------------------------');
    logging.info('Define Controller Routing');
    logging.info('--------------------------------------------');
    defineRoutes([MainController], app);

    app.use(routeNotFound);

    logging.info('--------------------------------------------');
    logging.info('Starting Server');
    logging.info('--------------------------------------------');

    httpServer = http.createServer(app);
    httpServer.listen(SERVER_PORT, () => {
        logging.info('--------------------------------------------');
        logging.info(`Server Started: ${SERVER_HOST}:${SERVER_PORT}`);
        logging.info('--------------------------------------------');
    });
};

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);

Main();
