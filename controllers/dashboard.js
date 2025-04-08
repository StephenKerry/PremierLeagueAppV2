'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js"; //here i am importing the teams collection model
import { v4 as uuidv4 } from 'uuid';


const dashboard = {
  createView(request, response) {
    logger.info("Dashboard page loading!");
    
    const viewData = {
      title: "EPL App Dashboard",
      teams: teamsCollection.getAllTeams() // here i fetch all teams from the collectiom
    };
    
    logger.debug(viewData.teams);
    
    response.render('dashboard', viewData);
  },
};

export default dashboard;
