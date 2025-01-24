'use strict';

import express from 'express';

const app = express();
const port = 3000;

app.get('/', (request, response) => response.send('Welcome to the Playlist app!'));

app.listen(port, () => console.log(`Express app running on port ${port}!`));