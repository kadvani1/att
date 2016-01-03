/*jslint browser: true, devel: true, node: true, debug: true, todo: true, indent: 2, maxlen: 150, unparam: true*/
/*global require, exports*/

'use strict';

var config = require('./att.dhs.config.js').config,
  restify = require('restify');

/**
 * @public
 * @function
 * getAuthorizeUrl
 * @summary
 * Returns user consent page url
 * @desc
 * Forms the consent page url by concatenating the API endpoint,
 * Authorization URI, Application Key and Application Scope in
 * a single URL string
 *
 * @returns {String} User consent page url
 *
 * @example
 * // Get user consent URL
 * var myDHS = require("att-dhs"),
 * authorizeURL = myDHS.getAuthorizeUrl();
 */

function getAuthorizeUrl() {
  console.info('dhs.oauth: getAuthorizeUrl');

  var envConfig;

  envConfig = config.getAppConfiguration();

  if (undefined === envConfig.app_key
      || undefined === envConfig.app_secret) {
    throw new Error('DHS configuration error. app_key and app_secret are mandatory');
  }

  return envConfig.api_endpoint + envConfig.authorize_uri +
    '?client_id=' + envConfig.app_key + '&' + 'scope=' + config.getScope('MOBILE_NUMBER');
}

/**
 * @public
 * @function
 * createAccessToken
 * @summary
 * Creates an Access Token using AT&T's OAuth for mobile number, virtual number and account id users
 * @desc
 * This methods accepts a `app_scope` and creates the `access token` for that particular `app_scope`
 * Accepted values for `app_scope` are: `MOBILE_NUMBER`, `VIRTUAL_NUMBER`,
 * `ACCOUNT_ID` and `E911`.
 * This method requires an access token obtained using `E911` auth_scope and a physical address with
 * obtained during the consent flow.
 *
 * @param {object} options
 * @param {string} options.app_scope - Application scope for getting access token
 * @param {string} [options.auth_code] - Authorization Code from user consent for mobile number user
 * @param {function} options.success - The callback that handles the successful response after creating an AT&T OAuth Access Token
 * @param {function} options.error - The callback that handles the generated error
 *
 * @example
 * // Create access token using DHS
 * var myDHS = require("att-dhs"),
 * options = {
 *   app_scope: 'E911',
 *   success: function (result) {
 *      // do something
 *   },
 *   error: function (err) {
 *      // do something
 *   }
 * };
 *
 * myDHS.createAccessToken(options);
 *
 * @example
 * // Create access token for Mobile Number using DHS
 * var myDHS = require("att-dhs"),
 * options = {
 *   app_scope: 'MOBILE_NUMBER',
 *   auth_code: 'auth_code_from_consent_flow',
 *   success: function (result) {
 *      // do something
 *   },
 *   error: function (err) {
 *      // do something
 *   }
 * };
 *
 * myDHS.createAccessToken(options);
 *
 * @example
 * // Create access token for Virtual Number using DHS
 * var myDHS = require("att-dhs"),
 * options = {
 *   app_scope: 'VIRTUAL_NUMBER',
 *   success: function (result) {
 *      // do something
 *   },
 *   error: function (err) {
 *      // do something
 *   }
 * };
 *
 * myDHS.createAccessToken(options);
 *
 * @example
 * // Create access token for Account ID using DHS
 * var myDHS = require("att-dhs"),
 * options = {
 *   app_scope: 'ACCOUNT_ID',
 *   success: function (result) {
 *      // do something
 *   },
 *   error: function (err) {
 *      // do something
 *   }
 * };
 *
 * myDHS.createAccessToken(options);
 */

function createAccessToken(options) {
  console.info('dhs.oauth: createAccessToken');
  console.info('options:', options);

  var envConfig,
    restClient,
    payload;

  envConfig = config.getAppConfiguration();

  if (undefined === envConfig.app_key
      || undefined === envConfig.app_secret) {
    throw new Error('DHS configuration error. app_key and app_secret are mandatory');
  }

  if (undefined === options
      || Object.keys(options).length === 0
      || undefined === options.app_scope) {
    throw new Error('No app_scope provided');
  }

  if ('MOBILE_NUMBER' !== options.app_scope
      && 'VIRTUAL_NUMBER' !== options.app_scope
      && 'ACCOUNT_ID' !== options.app_scope
      && 'E911' !== options.app_scope) {
    throw new Error('app_scope should be one of MOBILE_NUMBER, VIRTUAL_NUMBER, ACCOUNT_ID or E911');
  }

  if ('MOBILE_NUMBER' === options.app_scope
      && undefined === options.auth_code) {
    throw new Error('No auth_code provided');
  }

  if (undefined === options.success) {
    throw new Error('No success callback provided');
  }

  if (undefined === options.error) {
    throw new Error('No error callback provided');
  }

  restClient = restify.createStringClient({
    url: envConfig.api_endpoint,
    userAgent: envConfig.info.dhs_name,
    accept: 'application/json',
    rejectUnauthorized: false
  });

  payload = {
    client_id: envConfig.app_key,
    client_secret: envConfig.app_secret,
    grant_type: config.getGrantType(options.app_scope),
    scope: config.getScope(options.app_scope),
    code: options.auth_code
  };

  console.info('payload:', payload);

  restClient.post(envConfig.info.token_uri, payload, function (error, req, res, result) {
    if (undefined !== error &&
        null !== error) {
      console.error('error:', error);
      options.error(error);
      return;
    }
    options.success(JSON.parse(result));
  });
}

exports.oauth = {
  getAuthorizeUrl: getAuthorizeUrl,
  createAccessToken: createAccessToken
};