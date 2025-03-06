'use strict';

import logger from "../utils/logger.js";

const about = {
  createView(request, response) {
    logger.info("About page loading!");
    
    const viewData = {
      title: "Premier League App About" ,
      info:{"info": {
    "appTitle": "Premier League App",
    "version": 0.2,
    "creators": [
      {
        "name": "Stephen Kerry",
        "role": "Web Developer"  }
      
    ],
    "location": "Waterford"
  } 
}
    };
    
    response.render('about', viewData);
  },
};

export default about;
