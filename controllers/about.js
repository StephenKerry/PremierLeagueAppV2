'use strict';

import logger from "../utils/logger.js";
import accounts from './accounts.js';
import teamsCollection from '../models/mycollection.js';

const about = {
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);  
    logger.info("About page loading!");

    if (loggedInUser) {

      const userTeams = teamsCollection.getUserTeam(loggedInUser.id);  // Get the user's teams

      // Default values for a new user
      let numTeams = 20;  // Default number of teams for a new user
      let numPlayers = 40; // Default number of players for a new user

      // If the user already has teams, adjust the counts accordingly
      if (userTeams.length > 0) {
        numTeams += userTeams.length;  // Add the user's teams to the count
        numPlayers += userTeams.reduce((sum, team) => sum + team.players.length, 0);  // Add the number of players from each user team
      }

      let average = 0;

      if (numTeams > 0) {
        average = (numPlayers / numTeams).toFixed(1); // Calculate the average number of players per team
      }

      let max = 0;
      let min = 0;
      let maxtitle = [];
      let smalltitle = [];

      // Find the teams with the most and least players
      if (userTeams.length > 0) {
        const playerCounts = userTeams.map(team => team.players.length);
        max = Math.max(...playerCounts);
        min = Math.min(...playerCounts);

        for (let item of userTeams) {
          if (item.players.length === max) {
            maxtitle.push(item.name);
          }
          if (item.players.length === min) {
            smalltitle.push(item.name);
          }
        }
      }

      // Set up the view data to pass to the template
      const viewData = {
        title: "About the Premier League App",
        fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
        picture: loggedInUser.picture,
        displayNumTeams: numTeams,
        displayNumPlayers: numPlayers,
        displayAverage: average,
        displayLargest: max,
        displaySmallest: min,
        displaySmallestTitle: smalltitle,
        displayLargestTitle: maxtitle,
        info: {
          appTitle: "Premier League App",
          version: 0.2,
          creators: [
            {
              name: "Stephen Kerry",
              role: "Web Developer"
            }
          ],
          location: "Waterford"
        }
      };

      // Render the view
      response.render('about', viewData);
    } else {
      response.redirect('/');
    }
  },
};

export default about;
