'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";


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
  createView(request, response) {
    logger.info("Search page loading!");

    const viewData = {
      title: "Search Teams",
      managers: getManagers()
    };

    response.render('search', viewData);
  },

  findResult(request, response) {
    const manager = request.body.manager;
    logger.debug('Team manager = ' + manager);

    const viewData = {
      title: 'Search Results',
      foundPlaylists: teamsCollection.getTeamManager(manager),
      managers: getManagers(),
      managerName: manager
    };

    logger.debug(viewData.foundPlaylists);
    response.render('search', viewData);
  }
};

export default search;
