'use strict';

import logger from "../utils/logger.js";

const listinfo = {
  createView(request, response) {
    logger.info("Info page loading!");
    
    const viewData = {
      title: "Team Infomation Details"
    };
    
    response.render('listinfo', viewData);
  },
};

export default listinfo;
