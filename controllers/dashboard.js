'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";
import { v4 as uuidv4 } from 'uuid';

const dashboard = {
  // GET request handler for loading the dashboard view
  createView(request, response) {
    logger.info("Dashboard page loading!");

    const viewData = {
      title: "EPL App Dashboard",
      teams: teamsCollection.getAllTeams()
    };

    logger.debug(viewData.teams);
    response.render('dashboard', viewData);
  },

  
  addTeam(request, response) {
    const newTeam = {
      id: uuidv4(),
      title: request.body.title,
      manager: request.body.manager,
      players: [],
    };

    teamsCollection.addTeam(newTeam);
    response.redirect('/dashboard');
  }
};

export default dashboard;
