'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';

const teamsCollection = {
  store: new JsonStore('./models/mycollection.json', { teams: [] }),
  collection: 'teams',
array: 'players',

  
  getAllTeams() {
    return this.store.findAll(this.collection);
  }, 
  
  addTeam(team) {
    this.store.addCollection(this.collection, team);
}, 
  
  removePlayer(teamId, playerIndex) {
  this.store.removeItem(this.collection, teamId, 'players', playerIndex);
},


  removeManager(teamId) {
  const team = this.getInfo(teamId);
  if (team) {
    team.manager = '';
    this.store.save();
  }
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
