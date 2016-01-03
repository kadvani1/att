/*jslint browser: true, devel: true, node: true, debug: true, todo: true, indent: 2, maxlen: 150, unparam: true*/
/*global exports, require*/

'use strict';

var config = require('./att.dhs.config.js').config,
  oauth = require('./att.dhs.oauth.js').oauth,
  e911 = require('./att.dhs.e911.js').e911;

module.exports = {
  /**
   * @module
   * dhs
   *
   *@desc
   *
   * The `dhs` namespace provides a client API for using our optional DHS RESTful API.
   * The DHS RESTful API allows you to perform the following actions:
   *
   * * Create access tokens using AT&T's OAuth
   * * Create E911 Ids using AT&T's OAuth and API
   */
  configure: config.configure,
  getConfiguration: config.getConfiguration,
  getAuthorizeUrl: oauth.getAuthorizeUrl,
  createAccessToken: oauth.createAccessToken,
  createE911Id: e911.createE911Id
};
