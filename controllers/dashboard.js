'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";

const dashboard = {
  createView(request, response) {
    logger.info("Dashboard page loading!");
    
    const viewData = {
      title: "Playlist App Dashboard",
      playlists: teamsCollection.getAllTeams()
    };
    
    logger.debug(viewData.teams);
    
    response.render('dashboard', viewData);
  },
};

export default dashboard;
