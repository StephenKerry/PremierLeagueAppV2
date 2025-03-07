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
      teamImage: "https://cdn.glitch.global/3bfe7c46-328a-4b93-9d50-6d1e027faf0e/slot-anfield.jpg?v=1741352294964"
    };
    logger.info(viewData.singleTeam)
    response.render('listinfo', viewData);
  },
};

export default listinfo;
