'use strict';

import logger from "../utils/logger.js";
import teamsCollection from "../models/mycollection.js";
import accounts from './accounts.js';

const about = {
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);  
    logger.info("About page loading!");

    if (loggedInUser) {

      const userTeams = teamsCollection.getUserTeams(loggedInUser.id);  

      // Calculate statistics based on the user's playlists
      let numTeams = userTeams.length;
      let numPlayers = 0;
      let average = 0;

      for (let team of userTeams) {
        numPlayers += team.players.length;
      }

      if (numTeams > 0) {
        average = (numPlayers / numTeams).toFixed(1); 
      } else {
        average = 0;
      }

      let numbers = [];
      for (let team of userTeams) {
        numbers.push(team.players.length);
      }

      const max = Math.max(...numbers);
      const maxtitle = [];

      for (let team of userTeams) {
        if (team.players.length == max) {
          maxtitle.push(team.name);
        }
      }

      const smallest = Math.min(...numbers);
      const smalltitle = [];

      for (let team of userTeams) {
        if (team.players.length == smallest) {
          smalltitle.push(team.name);
        }
      }

     
      const viewData = {
        title: 'About YOUR App',
        fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
        picture: loggedInUser.picture,
        displayNumPlaylists: numTeams,
        displayNumSongs: numPlayers,
        displayAverage: average,
        displayLargest: max,
        displaySmallest: smallest,
        displaySmallestTitle: smalltitle,
        displayLargestTitle: maxtitle,
      };

      
      response.render('about', viewData);
    } else {
    
      response.redirect('/');
    }
  },
};

export default about;
