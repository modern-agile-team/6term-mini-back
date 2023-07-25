"use strict";

const movielikeStorage = require("./movielike.storage");

class Movielike {
  async getmovielike() {
    try {
      return await movielikeStorage.getmovielike();
    } catch (error) {
      return { sucess: false, msg: "movielike.service 오류" };
    }
  }

  async updatemovielike(movieid, userid) {
    try {
      const response = await movielikeStorage.updatemovielike(movieid, userid);
      return response;
    } catch (error) {
      return { sucess: false, msg: "movicelike.service 오류" };
    }
  }
}

module.exports = Movielike;
