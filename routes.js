'use strict';

import express from 'express';
import logger from "./utils/logger.js";

const router = express.Router();

// add your own routes below

import start from './controllers/start.js';
import dashboard from './controllers/dashboard.js'; 
import about from './controllers/about.js';
import listinfo from './controllers/listinfo.js'; 
import search from './controllers/search.js';
router.get('/search', search.createView);
router.get('/', start.createView);
router.get('/dashboard', dashboard.createView); 
router.get('/about', about.createView); 
router.get('/team/:id', listinfo.createView);  
router.get('/team/:id/deleteplayer/:index', listinfo.deletePlayer);
router.get('/team/:id/deletemanager', listinfo.deleteManager);
router.post('/team/:id/addplayer', listinfo.addPlayer);
router.get('/dashboard/deleteteam/:id', dashboard.deleteTeam);
router.post('/searchCategory', search.findResult);
router.post('/dashboard/addteam', dashboard.addTeam);




router.get('/error', (request, response) => response.status(404).end('Page not found.'));


export default router;
