'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';

const teamsCollection = {
  store: new JsonStore('./models/mycollection.json', { teams: [] }),
  collection: 'teams',
array: 'players',

 getUserTeam(userid) {
  return this.store.findBy(this.collection, team => team.userid === userid);
}, 
  getTeam(id) {
    return this.store.findOneBy(this.collection, (team => team.id === id));
},

  getAllTeams() {
    return this.store.findAll(this.collection);
  }, 
  
  getAllPlayers() {
  const teams = this.getAllTeams();
  let allPlayers = [];

  for (const team of teams) {
    if (Array.isArray(team.players)) {
      allPlayers = allPlayers.concat(team.players); 
    }
  }

  return allPlayers;
},

    async addTeam(team, response) {
    try {
      // call uploader function; takes in the playlist object, returns an image url
      team.picture = await this.store.uploader(team);

      // add playlist to JSON file, then return to dashboard controller
      this.store.addCollection(this.collection, team);
      response();
    } 
    // error handling
    catch (error) {
      logger.error("Error processing team:", error);
      response(error);
    }
  },

 
  
 async removePlayer(teamId, playerIndex) {
  const team = this.store.findOneBy(this.collection, (t) => t.id == teamId);
  if (team && Array.isArray(team.players) && playerIndex >= 0 && playerIndex < team.players.length) {
    team.players.splice(playerIndex, 1);
    await this.store.db.write(); // 
  }
},

 
  
   removeTeam(id) {
    const team = this.getTeam(id);
    this.store.removeCollection(this.collection, team);
},
 addPlayer(teamId, playerName) {
  const team = this.store.findOneBy(this.collection, (team) => team.id == teamId);

  if (team) {
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
  

getTeamManager(managerName) {
  const teams = this.getAllTeams();
  return teams.filter(team => team.manager === managerName);  // Filter teams by manager
}


};




export default teamsCollection;
