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

    // Filter out user teams already in the first 20
    const userTeamsNotInFirst20 = userTeams.filter(userTeam =>
      !first20Teams.some(publicTeam => publicTeam.id === userTeam.id)
    );

    // Combine and tag ownership
    const combinedTeams = [...first20Teams, ...userTeamsNotInFirst20].map(team => ({
      ...team,
      isUserTeam: team.userid === loggedInUser.id
    }));

    const viewData = {
      title: 'Teams Selection',
      teams: combinedTeams,
      fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      picture: loggedInUser.picture,
      currentUserId: loggedInUser.id
    };

    logger.info('Rendering dashboard with teams:', combinedTeams.map(t => t.name));
    response.render('dashboard', viewData);
  },

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
        : [],
      date: timestamp,
      picture: request.files.picture,
    };

    teamsCollection.addTeam(newTeam, function () {
      response.redirect("/dashboard");
    });
  },

  async deleteTeam(request, response) {
    const teamId = request.params.id;
    const loggedInUser = accounts.getCurrentUser(request);

    const team = teamsCollection.getInfo(teamId);

    if (team && team.userid === loggedInUser.id) {
      logger.debug(`User ${loggedInUser.id} deleting their own team ${teamId}`);
      await teamsCollection.removeTeam(teamId);
    } else {
      logger.warn(`User ${loggedInUser?.id} attempted to delete team ${teamId} they do not own`);
    }

    response.redirect("/dashboard");
  },
};

export default dashboard;
