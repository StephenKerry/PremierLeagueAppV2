'use strict';

import logger from "../utils/logger.js";
import accounts from './accounts.js';
import teamsCollection from '../models/mycollection.js';

const about = {
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.info("About page loading!");

    if (loggedInUser) {
      const allTeams = teamsCollection.getAllTeams();  // includes 20 default + user teams
      const userTeams = teamsCollection.getUserTeam(loggedInUser.id);

      let numTeams = allTeams.length;
      let numPlayers = 0;
      let average = 0;

      // Count all players from all teams
      for (let team of allTeams) {
        if (Array.isArray(team.players)) {
          numPlayers += team.players.length;
        }
      }

      if (numTeams > 0) {
        average = (numPlayers / numTeams).toFixed(1);
      } else {
        average = 0;
      }

      // Largest/smallest stats from user-created teams
      let numbers = [];
      for (let team of userTeams) {
        numbers.push(team.players.length);
      }

      let max = 0;
      let min = 0;
      let maxtitle = [];
      let smalltitle = [];

      if (numbers.length > 0) {
        max = Math.max(...numbers);
        min = Math.min(...numbers);

        for (let team of userTeams) {
          if (team.players.length === max) {
            maxtitle.push(team.name);
          }
          if (team.players.length === min) {
            smalltitle.push(team.name);
          }
        }
      }

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

      response.render('about', viewData);
    } else {
      response.redirect('/');
    }
  },
};

export default about;
