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
  const team = this.store.findOneBy(this.collection, (t) => t.id == teamId); // loose equality okay if ID type varies

  if (team && Array.isArray(team.players) && playerIndex >= 0 && playerIndex < team.players.length) {
    team.players.splice(playerIndex, 1);
    // or await this.store.write() if using async
  }
},

   removeTeam(id) {
    const team = this.getInfo(id);
    this.store.removeCollection(this.collection, team);
},
 addPlayer(teamId, playerName) {
  const team = this.store.findOneBy(this.collection, (team) => team.id == teamId);

  if (team) {
    // ✅ Ensure players array exists
    if (!Array.isArray(team.players)) {
      team.players = [];
    }

    // 🧹 Clean input and add it
    const cleanName = playerName.trim();
    if (cleanName.length > 0) {
      team.players.push(cleanName);
      
    }
  }
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
  
// In your teamsCollection model
getTeamManager(managerName) {
  const teams = this.getAllTeams();
  return teams.filter(team => team.manager === managerName);  // Filter teams by manager
}


};




export default teamsCollection;
