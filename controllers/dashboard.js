'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";
import { v4 as uuidv4 } from 'uuid';
import accounts from './accounts.js';


const dashboard = {
  // GET request handler for loading the dashboard view
    createView(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    if (loggedInUser) {
    const viewData = {
      title: 'Teams Selection',
      teams: teamsCollection.getUserTeams(loggedInUser.id),
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
    };
    logger.info('about to render' + viewData.teams);
    response.render('dashboard', viewData);
    }
    else response.redirect('/');
  },

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

    teamsCollection.addTeam(newTeam);
    response.redirect('/dashboard');
  }, 
  
  deleteTeam(request, response) {
    const teamId = request.params.id;
    logger.debug(`Deleting Team ${teamId}`);
    teamsCollection.removeTeam(teamId);
    response.redirect("/dashboard");
},

}; 


export default dashboard;
