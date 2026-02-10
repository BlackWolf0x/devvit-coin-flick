import express from 'express';
import { createServer, getServerPort } from '@devvit/web/server';
import apiRoutes from './routes/api';
import apiRoutess from './api/';
import internalRoutes from './routes/internal';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

// Mount route modules
app.use(apiRoutes);
app.use(apiRoutess);
app.use(internalRoutes);

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(getServerPort());
