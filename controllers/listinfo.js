'use strict';

import logger from "../utils/logger.js"; 
import playlistStore from '../models/playlist-store.js';

const listinfo = {
  createView(request, response) {
    logger.info("Info page loading!");
    
    const viewData = {
      title: "Team Infomation Details" ,
       singleTeam: mycollection.getAllTeams(teamsId)
    };
    
    response.render('listinfo', viewData);
  },
};

export default listinfo;
