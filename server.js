'use strict';

import express from 'express';
import logger from "./utils/logger.js";
import routes from './routes.js'; 

const app = express();
const port = 3000;

// app.use("/", routes);

app.get('/', (request, response) => response.send('This the home page'));
app.get('/hello', (request, response) => response.send('hello!!!'));
app.get('/test', (request, response) => response.send('This is a test page!'));

app.listen(port, () => logger.info("Your app is listening on port " + port));
