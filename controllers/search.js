'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";

const getCategories = () => {
  const categories = [];
  const teams = teamsCollection.getAllTeams();
  teams.forEach(element => {
    if (!categories.includes(element.category)) {
      categories.push(element.category);
    }
  });
  return categories;
}

const search = {
  createView(request, response) {
    logger.info("Search page loading!");
	
    const viewData = {
      title: "EPL App Search",
      categories: getCategories()
    };
    
    logger.debug(viewData.categories);
    
    response.render('search', viewData);
  },
  
};

export default search;
