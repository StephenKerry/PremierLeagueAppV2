'use strict';

import logger from "../utils/logger.js";
import accounts from './accounts.js';


const about = {
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request); // Check if user is logged in
    logger.info("About page loading!");

    if (loggedInUser) {
      // User is logged in, pass user info along with static app data
      const viewData = {
        title: "About the Premier League App",
        fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
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
      response.render('about', viewData); // Render the about view with the dynamic user info and static data
    } else {
      // If no user is logged in, redirect to the home page or login page
      response.redirect('/');
    }
  },
};

// here i am Exporting the 'about' controller so it can be used in other parts of the app
export default about;
