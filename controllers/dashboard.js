'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";
import { v4 as uuidv4 } from 'uuid';
import accounts from './accounts.js';

const dashboard = {
  createView(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    if (loggedInUser) {
      const first20Teams = teamsCollection.getAllTeams().slice(0, 20);
      const userTeams = teamsCollection.getUserTeam(loggedInUser.id);
      const combinedTeams = [...first20Teams, ...userTeams];

      const viewData = {
        title: 'Teams Selection',
        teams: combinedTeams,
        fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
        picture: loggedInUser.picture,
      };

      logger.info('about to render dashboard with teams:', viewData.teams);
      response.render('dashboard', viewData);
    } else {
      response.redirect('/');
    }
  },

  addTeam(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);   
    const newTeam = {
      id: uuidv4(),
      userid: loggedInUser.id,
      name: request.body.name,
      manager: request.body.manager,
      City: request.body.City,
      Stadium: request.body.Stadium,
      image: request.body.image,
      "manager-image": request.body["manager-image"],
      picture: request.files ? request.files.picture : null,
      players: [],
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
