'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";  // Ensure this is the correct model for teams
import accounts from './accounts.js';

// Get the list of managers
const getManagers = () => {
  const managers = [];
  const teams = teamsCollection.getAllTeams();  // Get all teams from the collection

  
  teams.forEach(team => {
    if (!managers.includes(team.manager)) {
      managers.push(team.manager);
    }
  });

  return managers;  // Return the list of unique managers
};

const search = {
  
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);  
    logger.info("Search page loading!");

    if (loggedInUser) {
      const viewData = {
        title: "Team Search",  
        managers: getManagers(),  
        foundTeams: [] ,
        picture: loggedInUser.picture,
        fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
      };

      logger.debug('Managers: ' + viewData.managers);  

      response.render('search', viewData);  
    } else {
      response.redirect('/');  
    }
  },

  
  findResult(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);  
    const manager = request.body.manager;  
    logger.debug('Manager selected = ' + manager);

    
    const foundTeams = teamsCollection.getTeamManager(manager);  

    const viewData = {
      title: 'Search Results',  
      foundTeams,  
      managers: getManagers(),  
      managerName: manager  
    };

    logger.debug('Found Teams: ' + JSON.stringify(viewData.foundTeams));  // 

    response.render('search', viewData);  
  }
};

export default search;
