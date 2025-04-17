'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";  // Ensure this is the correct model for teams
import accounts from './accounts.js';

// Get the list of managers
const getManagers = () => {
  const managers = [];
  const teams = teamsCollection.getAllTeams();  // Get all teams from the collection

  // Loop through teams and add unique managers to the list
  teams.forEach(team => {
    if (!managers.includes(team.manager)) {
      managers.push(team.manager);
    }
  });

  return managers;  // Return the list of unique managers
};

const search = {
  // Render the search page with a dropdown for managers
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);  // Get the current logged-in user
    logger.info("Search page loading!");

    if (loggedInUser) {
      const viewData = {
        title: "Team Search",  // Title of the page
        managers: getManagers(),  // Fetch the list of managers
        foundTeams: []  // No results to show initially
      };

      logger.debug('Managers: ' + viewData.managers);  // Log the managers for debugging

      response.render('search', viewData);  // Render the search page with the managers and no teams found
    } else {
      response.redirect('/');  // Redirect to home if no user is logged in
    }
  },

  // Handle the form submission and search for teams by manager
  findResult(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);  // Get the current logged-in user
    const manager = request.body.manager;  // Get the selected manager from the form
    logger.debug('Manager selected = ' + manager);

    // Filter the teams by the selected manager
    const foundTeams = teamsCollection.getTeamManager(manager);  // Get teams managed by the selected manager

    const viewData = {
      title: 'Search Results',  // Title of the results page
      foundTeams,  // Show the found teams
      managers: getManagers(),  // Fetch the list of managers for the dropdown again
      managerName: manager  // Show the selected manager in the results
    };

    logger.debug('Found Teams: ' + JSON.stringify(viewData.foundTeams));  // Log the found teams for debugging

    response.render('search', viewData);  // Render the search results with the teams found and managers
  }
};

export default search;
