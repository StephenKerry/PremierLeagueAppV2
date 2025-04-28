'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";
import { v4 as uuidv4 } from 'uuid';
import accounts from './accounts.js';

const dashboard = {
  // GET request handler for loading the dashboard view
  createView(request, response) {
    logger.info('dashboard rendering');
    
    const loggedInUser = accounts.getCurrentUser(request);  // Get the current user
    
    // Check if the logged-in user exists
    if (loggedInUser) {
      // Fetch the first 20 teams and the teams that the user has created
      const first20Teams = teamsCollection.getAllTeams().slice(0, 20); // Get first 20 teams
      const userTeams = teamsCollection.getUserTeam(loggedInUser.id);  // Get user-specific teams

      // Combine both sets of teams (first 20 teams and user-created teams)
      const combinedTeams = [...first20Teams, ...userTeams];

      // Prepare view data
      const viewData = {
        title: 'Teams Selection',
        teams: combinedTeams,  // Combined teams data
        fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
      };

      logger.info('about to render dashboard with teams:', viewData.teams);

      response.render('dashboard', viewData);  // Render the dashboard if user exists
    } else {
      response.redirect('/');  // Redirect to the home page if no user is logged in
    }
  },

  // Add team method (unchanged)
  addTeam(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug(loggedInUser.id);
    const newTeam = {
      id: uuidv4(),
      userid: loggedInUser.id,
      name: request.body.name,
      manager: request.body.manager,
      image: request.body.image,
      "manager-image": request.body["manager-image"],
      City: request.body.City,
      Stadium: request.body.Stadium, 
      picture: request.files.picture,
      players: request.body.players.split(",").map(p => p.trim())
    };

    teamsCollection.addTeam(newTeam, function(){  response.redirect("/dashboard");                                            }; // Add new team to the collection// Redirect to dashboard after adding team
  })

  // Delete team method (unchanged)
  deleteTeam(request, response) {
    const teamId = request.params.id;
    logger.debug(`Deleting Team ${teamId}`);
    teamsCollection.removeTeam(teamId); // Remove team by ID
    response.redirect("/dashboard"); // Redirect to dashboard after deleting
  },
};

export default dashboard;
