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
      let numPlayers = 0;
      let average = 0;

      for (let item of userTeams) {
        numPlayers += item.players.length;
      }

      if (numTeams > 0) {
        average = (numPlayers / numTeams).toFixed(1);
      } else {
        average = 0;
      }

      let numbers = [];
      for (let item of userTeams) {
        numbers.push(item.players.length);
      }

      const max = Math.max(...numbers);
      const maxtitle = [];

      for (let item of userTeams) {
        if (item.players.length === max) {
          maxtitle.push(item.name);
        }
      }

      const smallest = Math.min(...numbers);
      const smalltitle = [];

      for (let item of userTeams) {
        if (item.players.length === smallest) {
          smalltitle.push(item.name);
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
        displaySmallest: smallest,
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
