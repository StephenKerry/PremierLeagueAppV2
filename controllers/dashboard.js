'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";
import { v4 as uuidv4 } from 'uuid';
import accounts from './accounts.js';


const dashboard = {
  // GET request handler for loading the dashboard view
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    if (loggedInUser) {
      const viewData = {
        title: 'Teams Selection',
        teams: teamsCollection.getUserTeams(loggedInUser.id), // Get the user's teams
        fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
      };

      logger.debug('Rendering dashboard with teams: ' + JSON.stringify(viewData.teams));
      response.render('dashboard', viewData); // Render dashboard page with teams data
    } else {
      response.redirect('/'); // Redirect to login or home page if not logged in
    }
  },

  // Add team method (unchanged)
  addTeam(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug(loggedInUser.id);
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

    teamsCollection.addTeam(newTeam); // Add new team to the collection
    response.redirect('/dashboard'); // Redirect to dashboard after adding team
  },

  // Delete team method (unchanged)
  deleteTeam(request, response) {
    const teamId = request.params.id;
    logger.debug(`Deleting Team ${teamId}`);
    teamsCollection.removeTeam(teamId); // Remove team by ID
    response.redirect("/dashboard"); // Redirect to dashboard after deleting
  },
};
 


export default dashboard;
