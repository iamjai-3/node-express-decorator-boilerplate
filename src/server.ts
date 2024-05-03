import http from 'http';
import express from 'express';
import 'reflect-metadata';

import './config/logging';
import { loggingHandler } from './middleware/loggingHandler';
import { corsHandler } from './middleware/corsHandler';
import { routeNotFound } from './middleware/routeNotFound';
import { SERVER_HOST, SERVER_PORT, mongo } from './config/config';
import { defineRoutes } from './modules/routes';
import MainController from './controllers/main';
import mongoose from 'mongoose';
import BookController from './controllers/book';
import { declareHandler } from './middleware/declareHandler';

export const app = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = async () => {
    logging.log('Initializing API...');
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    logging.log('Connecting to MongoDB...');
    try {
        const connection = await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
        logging.log('Connected to MongoDB: v', connection.version);
    } catch (error) {
        logging.log('Unable to connect to MongoDB');
        logging.error(error);
    }

    logging.log('Logging & Configuration');
    app.use(declareHandler);
    app.use(loggingHandler);
    app.use(corsHandler);

    logging.log('Define Controller Routing');
    defineRoutes([MainController, BookController], app);

    app.use(routeNotFound);

    logging.log('Starting Server...');
    httpServer = http.createServer(app);
    httpServer.listen(SERVER_PORT, () => {
        logging.log(`Server Started: ${SERVER_HOST}:${SERVER_PORT}`);
    });
};

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);

Main();
