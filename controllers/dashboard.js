'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";
import { v4 as uuidv4 } from 'uuid';
import accounts from './accounts.js';

const dashboard = {
  createView(request, response) {
  logger.info('Rendering dashboard');

  const loggedInUser = accounts.getCurrentUser(request);
  if (loggedInUser) {
   

  const publicTeams = teamsCollection.getAllTeams().slice(0, 20);
  const userTeams = teamsCollection.getUserTeam(loggedInUser.id) || [];

  const combinedTeams = [...publicTeams, ...userTeams].map(team => ({
    ...team,
    isUserTeam: team.userid === loggedInUser.id
  }));

  const viewData = {
    title: 'Teams Selection',
     fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
    picture: loggedInUser.picture,
    currentUserId: loggedInUser.id,
    teams: combinedTeams
  };

  logger.info(`Loaded ${combinedTeams.length} teams for dashboard`);
  response.render('dashboard', viewData);
}},


  async addTeam(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const timestamp = new Date();

    const newTeam = {
      id: uuidv4(),
      userid: loggedInUser.id,
      name: request.body.name,
      manager: request.body.manager,
      City: request.body.City,
      Stadium: request.body.Stadium,
      players: request.body.players
        ? request.body.players.split(',').map(player => player.trim())
        : [],// the split() takes the seperated comma string input and splits it into an array seperated by the commas, the trim removes the whitespace
      date: timestamp,
      picture: request.files.picture,
    };

    teamsCollection.addTeam(newTeam, function () {
      response.redirect("/dashboard");
    });
  },

  deleteTeam(request, response) {
    const teamId = request.params.id;
    logger.debug(`Deleting Team ${teamId}`);
    teamsCollection.removeTeam(teamId);
    response.redirect("/dashboard");
},
   
};

export default dashboard;
