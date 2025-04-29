'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";
import { v4 as uuidv4 } from 'uuid';
import accounts from './accounts.js';

const dashboard = {
  
 createView(request, response) {
  logger.info('dashboard rendering');

  const loggedInUser = accounts.getCurrentUser(request);

  if (!loggedInUser || !loggedInUser.id) {
    logger.warn("User not logged in or missing ID. Redirecting.");
    return response.redirect('/');
  }

  const allTeams = teamsCollection.getAllTeams();
  const first20Teams = allTeams.slice(0, 20);

  const userTeams = teamsCollection.getUserTeam(loggedInUser.id) || [];

  // Add only the user's own teams if they are NOT already in the first 20
  const userTeamsNotInFirst20 = userTeams.filter(userTeam =>
    !first20Teams.some(publicTeam => publicTeam.id === userTeam.id)
  );

  // Final list to render: first 20 global + user's teams (not duplicated)
  const combinedTeams = [...first20Teams, ...userTeamsNotInFirst20];

  const viewData = {
    title: 'Teams Selection',
    teams: combinedTeams,
    fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
    picture: loggedInUser.picture,
  };

  logger.info('Rendering dashboard with teams:', combinedTeams.map(t => t.name));
  response.render('dashboard', viewData);
}
,

  
  addTeam(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const timestamp = new Date();

    
    const newTeam = {
      id: uuidv4(),
      userid: loggedInUser.id,
      name: request.body.name,
      manager: request.body.manager,
      City: request.body.City,
      Stadium: request.body.Stadium,
      players: request.body.players ? request.body.players.split(',').map(player => player.trim()) : [], // Convert players into an array
      date: timestamp,
      picture: request.files.picture,  
    };

    
    teamsCollection.addTeam(newTeam, function() {
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
