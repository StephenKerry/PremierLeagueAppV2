'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';

const teamsCollection = {
  store: new JsonStore('./models/mycollection.json', { teams: [] }),
  collection: 'teams',
array: 'players',

 getUserTeam(userid) {
  if (!userid) {
    logger.warn("getUserTeam called with missing userid");
    return [];
  }
  return this.store.findBy(this.collection, team => team.userid === userid);
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

  async removeTeam(id) {
  const team = this.store.findOneBy(this.collection, (team) => team.id == id); // Get the team by id
  
  if (team) {
    // If the team is found, remove it from the collection
    const index = this.store.db.data[this.collection].indexOf(team);
    if (index !== -1) {
      this.store.db.data[this.collection].splice(index, 1); // Remove the team from the array
      await this.store.db.write(); // Wait for the write operation to complete
      logger.info(`Team with id ${id} removed successfully.`);
    }
  } else {
    logger.error(`Team with id ${id} not found.`);
  }
}
,
 addPlayer(teamId, playerName) {
  const team = this.store.findOneBy(this.collection, (team) => team.id == teamId);

  if (team) {

    if (!Array.isArray(team.players)) {
      team.players = [];
    }


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
