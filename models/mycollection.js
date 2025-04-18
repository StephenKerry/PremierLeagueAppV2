'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';

const teamsCollection = {
  store: new JsonStore('./models/mycollection.json', { teams: [] }),
  collection: 'teams',
  array: 'players',

  // Get team by user ID
  getUserTeam(userid) {
    return this.store.findBy(this.collection, (team) => team.userid === userid);
  },

  // Get all teams
  getAllTeams() {
    return this.store.findAll(this.collection);
  },

  // Get all players from all teams
  getAllPlayers() {
    const teams = this.getAllTeams(); // get all teams
    let allPlayers = [];

    for (const team of teams) {
      if (Array.isArray(team.players)) {
        allPlayers = allPlayers.concat(team.players); // merge all players from each team
      }
    }

    return allPlayers;
  },

  // Add a new team
  addTeam(team) {
    this.store.addCollection(this.collection, team);
  },

  // Remove a player from a team
  async removePlayer(teamId, playerIndex) {
    const team = this.store.findOneBy(this.collection, (t) => t.id == teamId);
    if (team && Array.isArray(team.players) && playerIndex >= 0 && playerIndex < team.players.length) {
      team.players.splice(playerIndex, 1);
      await this.store.db.write(); // ✅ Save to disk
    }
  },

  // Remove a team
  async removeTeam(id) {
    const team = this.store.findOneBy(this.collection, (team) => team.id == id); // Get the team by id
    if (team) {
      const index = this.store.db.data[this.collection].indexOf(team);
      if (index !== -1) {
        this.store.db.data[this.collection].splice(index, 1); // Remove the team from the array
        await this.store.db.write(); // Wait for the write operation to complete
        logger.info(`Team with id ${id} removed successfully.`);
      }
    } else {
      logger.error(`Team with id ${id} not found.`);
    }
  },

  // Add a player to a team
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

  // Remove a manager from a team
  removeManager(teamId) {
    const team = this.getInfo(teamId);
    if (team) {
      team.manager = '';
    }
  },

  // Get information about a specific team
  getInfo(id) {
    return this.store.findOneBy(this.collection, (teams) => teams.id == id);
  },

  // Get all teams managed by a specific manager
  getTeamManager(managerName) {
    const teams = this.getAllTeams();
    return teams.filter(team => team.manager === managerName);  // Filter teams by manager
  }
};

export default teamsCollection;
