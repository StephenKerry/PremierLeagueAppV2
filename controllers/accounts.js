'use strict';

import logger from '../utils/logger.js';
import userStore from '../models/user-store.js';
import teamsCollection from '../models/mycollection.js';  // Importing the teams collection
import { v4 as uuidv4 } from 'uuid';

const accounts = {

  //index function to render index page
  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },
  
  //login function to render login page
  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },
  
  //logout function to render logout page
  logout(request, response) {
    response.cookie('team', '');
    response.redirect('/');
  },
  
  //signup function to render signup page
  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },
  
  //register function to render the registration page for adding a new user
  register(request, response) {
    const user = request.body;
    user.id = uuidv4();
    userStore.addUser(user);
    logger.info('registering ' + user.email);

    // Create a new team for the user upon registration
    const newTeam = {
      id: uuidv4(),
      userid: user.id,
      name: `${user.name}'s Team`,
      manager: '',
      players: []
    };

    // Add the newly created team to the teams collection
    teamsCollection.addTeam(newTeam);

    response.redirect('/');
  },
  
  //authenticate function to check user credentials and either render the login page again or the start page.
  authenticate(request, response) {
    const user = userStore.getUserByEmail(request.body.email);
    if (user && user.password === request.body.password) {
      response.cookie('team', user.email);
      logger.info('Logging in: ' + user.email);

      // Fetch user's team from the teamsCollection
      const userTeam = teamsCollection.getUserTeam(user.id);

     
    }
  },
  
  //utility function getCurrentUser to check who is currently logged in
  getCurrentUser(request) {
    const userEmail = request.cookies.team;
    return userStore.getUserByEmail(userEmail);
  },

  // Function to reset teams and players for the logged-in user
  resetTeamsAndPlayersForUser(userEmail) {
    const user = userStore.getUserByEmail(userEmail);
    const userTeam = teamsCollection.getUserTeam(user.id);

    // Clear player's data if any (or handle other specific logic you want)
    if (userTeam) {
      userTeam.players = [];
      userTeam.manager = '';  // Optionally clear manager as well
      logger.info(`Resetting team data for user: ${user.email}`);
      teamsCollection.addTeam(userTeam);  // Save the reset team data
    }
  }
};

export default accounts;
