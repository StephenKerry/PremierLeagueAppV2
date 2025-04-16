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
      
    };
    logger.info(viewData.singleTeam)
    response.render('listinfo', viewData);
  }, 
  
  deletePlayer(request, response) {
  const teamId = request.params.id;
  const playerIndex = request.params.index;
  logger.debug(`Deleting Player at index ${playerIndex} from Team ${teamId}`);
  db.removePlayer(teamId, playerIndex);
  response.redirect('/team/' + teamId);
},

deleteManager(request, response) {
  const teamId = request.params.id;
  logger.debug(`Deleting Manager from Team ${teamId}`);
  db.removeManager(teamId);
  response.redirect('/team/' + teamId);
},

};

export default listinfo;
