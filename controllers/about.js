'use strict';

import logger from "../utils/logger.js";

const about = {
  createView(request, response) {
    logger.info("About page loading!");
    
    const viewData = {
      title: "Premier League App About"
    };
    
    response.render('about', viewData);
  },
};

export default about;
