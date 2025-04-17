'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";
import accounts from './accounts.js';


const start = {
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request); // Check if user is logged in
    logger.info("Start page loading!");

    if (loggedInUser) {
      // User is logged in, prepare the viewData with user info and teams info
      const viewData = {
        title: "Welcome to the Premier League App!",
        fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
        teams: teamsCollection.getAllTeams(), // Get all teams from the collection
      };
      response.render('start', viewData); // Render the start page with user and teams data
    } else {
      // If no user is logged in, redirect to the home page or login page
      response.redirect('/');
    }
  },
};


export default start;
