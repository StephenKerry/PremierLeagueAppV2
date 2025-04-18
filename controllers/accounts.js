'use strict';

import logger from '../utils/logger.js';
import userStore from '../models/user-store.js';
import teamsCollection from '../models/mycollection.js';
import { v4 as uuidv4 } from 'uuid';

const accounts = {

  // Index page
  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },

  // Login page
  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  // Logout
  logout(request, response) {
    response.cookie('team', '');
    response.redirect('/');
  },

  // Signup page
  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },

  // Register user (without creating a new team)
  register(request, response) {
    const user = request.body;
    user.id = uuidv4();
    userStore.addUser(user);
    logger.info('Registering ' + user.email);
    response.redirect('/');
  },

  // Authenticate login
  authenticate(request, response) {
    const user = userStore.getUserByEmail(request.body.email);
    if (user && user.password === request.body.password) {
      response.cookie('team', user.email);
      logger.info('Logging in: ' + user.email);
      response.redirect('/start');
    } else {
      response.redirect('/login');
    }
  },

  // Get current logged-in user
  getCurrentUser(request) {
    const userEmail = request.cookies.team;
    return userStore.getUserByEmail(userEmail);
  },

  // Reset user's team and players
  resetTeamsAndPlayersForUser(userEmail) {
    const user = userStore.getUserByEmail(userEmail);
    const userTeam = teamsCollection.getUserTeam(user.id);

    if (userTeam) {
      userTeam.players = [];
      userTeam.manager = '';
      logger.info(`Resetting team data for user: ${user.email}`);
      teamsCollection.addTeam(userTeam); // You might want to change this to updateTeam
    }
  }
};

export default accounts;
