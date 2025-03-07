'use strict';

import logger from "../utils/logger.js"; 
import teamsCollection from '../models/mycollection.js';

const listinfo = {
  createView(request, response) {
    logger.info("Info page loading!"); 
    const teamsId = request.params.id;
    logger.debug('Teams id = ' + teamsId);
    
    const viewData = {
      title: "Team Infomation Details" ,
       singleTeam: teamsCollection.getInfo(teamsId), 
      teamImage: "https://example.com/default-team-image.jpg" 
    };
    logger.info(viewData.singleTeam)
    response.render('listinfo', viewData);
  },
};

export default listinfo;
