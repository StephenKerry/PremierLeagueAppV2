'use strict';

import logger from "../utils/logger.js";
import accounts from './accounts.js';
import teamsCollection from '../models/mycollection.js';

const about = {
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.info("About page loading!");

    if (loggedInUser) {
      const userTeams = teamsCollection.getUserTeam(loggedInUser.id);

      let numTeams = 20 + userTeams.length;
      let numPlayers = 40;
      let average = 0;

      // Only track user-created team player counts
      let numbers = [];

      for (let item of userTeams) {
        const count = item.players.length;
        numPlayers += count;
        numbers.push(count);
      }

      if (numTeams > 0) {
        average = (numPlayers / numTeams).toFixed(1);
      }

      let max = 0;
      let min = 0;
      let maxtitle = [];
      let smalltitle = [];

      if (numbers.length > 0) {
        max = Math.max(...numbers);
        min = Math.min(...numbers);

        for (let item of userTeams) {
          if (item.players.length === max) {
            maxtitle.push(item.name);
          }
          if (item.players.length === min) {
            smalltitle.push(item.name);
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
