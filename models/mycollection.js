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
   removeTeam(id) {
    const team = this.getInfo(id);
    this.store.removeCollection(this.collection, team);
},
  addPlayer(teamId, playerName) {
  this.store.addItem(this.collection, teamId, 'players', playerName);
},



  removeManager(teamId) {
  const team = this.getInfo(teamId);
  if (team) {
    team.manager = '';
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
