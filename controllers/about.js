'use strict';
import logger from "../utils/logger.js";

const about = {
  createView(request, response) {
    logger.info("Start page loading!");
    
    const viewData = {
      title: "Welcome to the Playlist app!",
      info: appStore.getAppInfo()
    };
    
    //logger.debug(viewData);
    response.render('start', viewData);   
  },
};

export default about;

const start = {
  createView(request, response) {
    logger.info("Start page loading!");
    
    const viewData = {
      title: "Welcome to the Playlist app!",
      info: appStore.getAppInfo()
    };
    
    //logger.debug(viewData);
    response.render('start', viewData);   
  },
};

export default start;