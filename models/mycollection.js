'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';

const teamsCollection = {
  store: new JsonStore('./models/mycollection.json', { users: [] }), // Assuming the JSON structure starts with an empty array of users
  collection: 'users', // This will be "users" instead of "teams" for the user-specific collection
  array: 'players',

  // Get user by user ID
  getUser(userid) {
    return this.store.findBy(this.collection, (user) => user.userId === userid);
  },

  // Get all users
  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  // Add a player to a specific team's custom collection for a user
  async addPlayerToUserTeam(userId, teamId, playerName) {
    const user = this.getUser(userId); // Get the user by userId

    if (!user) {
      logger.error(`User with ID ${userId} not found.`);
      return;
    }

    // Check if the user has this team in their collection, if not, initialize it
    if (!user.mycollection) {
      user.mycollection = { teams: [], customTeams: {} };
    }

    if (!user.mycollection.customTeams[teamId]) {
      user.mycollection.customTeams[teamId] = { players: [] };
    }

    // Add player to the specific team
    const cleanName = playerName.trim();
    if (cleanName.length > 0) {
      const team = user.mycollection.customTeams[teamId];
      if (!team.players.includes(cleanName)) {
        team.players.push(cleanName);
        logger.info(`Player ${playerName} added to team ${teamId} for user ${userId}.`);

        // Ensure the team ID is added to the user's `teams` collection if it's not already there
        if (!user.mycollection.teams.includes(teamId)) {
          user.mycollection.teams.push(teamId);
        }

        await this.store.db.write(); // Save the changes to disk
      } else {
        logger.info(`Player ${playerName} is already in team ${teamId} for user ${userId}.`);
      }
    } else {
      logger.error(`Invalid player name: ${playerName}`);
    }
  },

  // Example function to remove a player (not shown in your original code)
  async removePlayerFromUserTeam(userId, teamId, playerName) {
    const user = this.getUser(userId);

    if (user && user.mycollection && user.mycollection.customTeams[teamId]) {
      const team = user.mycollection.customTeams[teamId];
      const playerIndex = team.players.indexOf(playerName);

      if (playerIndex !== -1) {
        team.players.splice(playerIndex, 1);
        logger.info(`Player ${playerName} removed from team ${teamId} for user ${userId}.`);
        await this.store.db.write();
      } else {
        logger.error(`Player ${playerName} not found in team ${teamId} for user ${userId}.`);
      }
    } else {
      logger.error(`Team ${teamId} not found for user ${userId}.`);
    }
  },

  // Get all players for a user from custom teams
  getPlayersForUser(userId) {
    const user = this.getUser(userId);
    if (user && user.mycollection && user.mycollection.customTeams) {
      let allPlayers = [];
      for (const teamId in user.mycollection.customTeams) {
        if (user.mycollection.customTeams[teamId].players) {
          allPlayers = allPlayers.concat(user.mycollection.customTeams[teamId].players);
        }
      }
      return allPlayers;
    }
    return [];
  },

  // Add a team for a user (if needed)
  addTeamForUser(userId, teamId) {
    const user = this.getUser(userId);
    if (user) {
      if (!user.mycollection) {
        user.mycollection = { teams: [], customTeams: {} };
      }
      if (!user.mycollection.teams.includes(teamId)) {
        user.mycollection.teams.push(teamId);
        logger.info(`Team ${teamId} added to user ${userId}.`);
        this.store.db.write(); // Save the updated data
      } else {
        logger.info(`Team ${teamId} already in user ${userId}'s collection.`);
      }
    } else {
      logger.error(`User ${userId} not found.`);
    }
  },

  // Get info about a specific user's custom team
  getUserTeamInfo(userId, teamId) {
    const user = this.getUser(userId);
    if (user && user.mycollection && user.mycollection.customTeams[teamId]) {
      return user.mycollection.customTeams[teamId];
    }
    return null;
  }
};

export default teamsCollection;
