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
  
    
    
	findResult(request, response) {
    const category = request.body.category;
    logger.debug('Team category = ' + category);

    const viewData = {
      title: 'Playlist',
      foundPlaylists: playlistStore.getPlaylistCategory(category),
      categories: getCategories(),
      categoryTitle: category
    };
    
    logger.debug(viewData.foundPlaylists);
    
    response.render('search', viewData);
},

  
};

export default search;
