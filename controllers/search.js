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
    const managers = getManagers().map(name => ({
      name,
      selected: false
    }));

    const viewData = {
      title: "Search Teams",
      managers,
      foundManagers: []
    };

    response.render('search', viewData);
  },

  findResult(request, response) {
    const manager = request.body.manager;
    const managers = getManagers().map(name => ({
      name,
      selected: name === manager
    }));

    const viewData = {
      title: 'Search Results',
      managers,
      foundManagers: teamsCollection.getTeamManager(manager),
      managerName: manager
    };

    response.render('search', viewData);
  }
};

export default search;
