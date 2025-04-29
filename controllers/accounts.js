'use strict';

import logger from '../utils/logger.js';
import userStore from '../models/user-store.js';
import teamsCollection from '../models/mycollection.js';
import { v4 as uuidv4 } from 'uuid';

const accounts = {

  // Index page
  index(request, response) {
    const allTeams = teamsCollection.getAllTeams();
    const allPlayers = teamsCollection.getAllPlayers();

    let largestTeamSize = 0;
    let smallestTeamSize = Number.MAX_SAFE_INTEGER;
    let largestTeams = [];
    let smallestTeams = [];

    for (const team of allTeams) {
      const teamSize = team.players ? team.players.length : 0;
      
      if (teamSize > largestTeamSize) {
        largestTeamSize = teamSize;
        largestTeams = [team.name];
      } else if (teamSize === largestTeamSize) {
        largestTeams.push(team.name);
      }

      if (teamSize < smallestTeamSize) {
        smallestTeamSize = teamSize;
        smallestTeams = [team.name];
      } else if (teamSize === smallestTeamSize) {
        smallestTeams.push(team.name);
      }
    }

    // Handle if no teams
    if (allTeams.length === 0) {
      smallestTeamSize = 0;
      largestTeamSize = 0;
    }

    const viewData = {
      title: 'Login or Signup',
      displayNumTeams: allTeams.length,
      displayNumPlayers: allPlayers.length,
      displayAverage: allTeams.length > 0 ? (allPlayers.length / allTeams.length).toFixed(2) : 0,
      displayLargest: largestTeamSize,
      displayLargestTitle: largestTeams,
      displaySmallest: smallestTeamSize,
      displaySmallestTitle: smallestTeams,
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
  async register(request, response) {
    const user = {
      id: uuidv4(),
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password,
    };

    const file = request.files?.profilepic;  

    try {
      
      if (!file) {
        logger.error('No file uploaded!');
        response.status(400).send('No profile picture uploaded.');
        return;
      }

      
      await userStore.addUser(user, file);

      
      logger.info('Registering user: ' + user.email);
      response.cookie('team', user.email);  
      response.redirect('/start');  
    } catch (err) {
      logger.error('Error registering user:', err);
      response.status(500).send('Registration failed. Please try again.');
    }
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
      teamsCollection.addTeam(userTeam); // You might want to change this to updateTeam if needed
    }
  }
};

export default accounts;
