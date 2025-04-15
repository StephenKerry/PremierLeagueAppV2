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
    name: request.body.name,
    manager: request.body.manager,
    image: request.body.image,
    "manager-image": request.body["manager-image"],
    City: request.body.City,
    Stadium: request.body.Stadium,
    players: request.body.players.split(",").map(p => p.trim())
  };

    teamsCollection.addTeam(newTeam);
    response.redirect('/dashboard');
  }
};

export default dashboard;
