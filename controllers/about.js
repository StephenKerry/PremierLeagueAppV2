'use strict';

import logger from "../utils/logger.js";

const about = {
  createView(request, response) {
    logger.info("About page loading!");

     // Data  passed through the 'about' view 
    const viewData = {
      title: "Premier League App About",
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
  },
};
// here i am Exporting the 'about' controller so it can be used in other parts of the app
export default about;
