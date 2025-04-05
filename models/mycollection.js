'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';

const teamsCollection = {
  store: new JsonStore('./models/mycollection.json', { teams: [] }),
  collection: 'teams',


  
  getAllTeams() {
    return this.store.findAll(this.collection);
  },

  
  getInfo(id) {
    return this.store.findOneBy(this.collection, (teams => teams.id == id));
  }, 
  
  getTeamManager(manager, userid) {
    return this.store.findBy(
      this.collection,
      (team => team.manager.toLowerCase() === manager.toLowerCase() && 
	   team.userid === userid)
      );
},
};




export default teamsCollection;
