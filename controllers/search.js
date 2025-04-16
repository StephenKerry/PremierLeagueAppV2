'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";

// Get the list of managers
const getManagers = () => {
  const managers = [];
  const teams = teamsCollection.getAllTeams();
  teams.forEach(team => {
    if (!managers.includes(team.manager)) {
      managers.push(team.manager);
    }
  });
  return managers;
};

const search = {
  // Render the search page with a dropdown for managers
  createView(request, response) {
    logger.info("Search page loading!");

    const viewData = {
      title: "Team Search",
      managers: getManagers(),  // Fetch the list of managers
      foundTeams: []  // No results to show initially
    };

    response.render('search', viewData);  // Render the search page
  },

  // Handle the form submission and search for teams by manager
  findResult(request, response) {
    const manager = request.body.manager;
    logger.debug('Manager selected = ' + manager);

    // Filter the teams by the selected manager
    const foundTeams = teamsCollection.getTeamManager(manager);  // Get teams managed by the selected manager

    const viewData = {
      title: 'Search Results',
      foundTeams,  // Show the found teams
      managers: getManagers(),  // Fetch the list of managers for the dropdown
      managerName: manager  // Show the selected manager
    };

    logger.debug(viewData.foundTeams);  // Log the found teams for debugging

    response.render('search', viewData);  // Render the search results
  }
};

export default search;
