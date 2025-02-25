'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";

const start = {
  createView(request, response) {
    logger.info("Start page loading!");
    
    const viewData = {
      title: "CA1 Starter App",
      info: teamsCollection.getAllTeams()
    };
    
    response.render('start', viewData);   
  },
};

export default start;
