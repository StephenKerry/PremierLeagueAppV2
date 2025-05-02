'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";
import accounts from './accounts.js';


const start = {
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request); 
    logger.info("Start page loading!");

    if (loggedInUser) {
      
      const viewData = {
        title: "Welcome to the Premier League App!",
        fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
        teams: teamsCollection.getAllTeams(),
        picture: loggedInUser.picture
      };
      response.render('start', viewData); 
    } else {
      
      response.redirect('/');
    }
  },
};


export default start;
