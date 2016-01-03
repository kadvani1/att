/*jslint browser: true, devel: true, node: true, debug: true, todo: true, indent: 2, maxlen: 150, unparam: true*/
/*global exports, require*/

'use strict';

var pkg = require('../package.json'),
  grantTypesMap,
  config;

// initialize the default configuration form package.json
config = pkg.config;

grantTypesMap = {
  'MOBILE_NUMBER': 'authorization_code',
  'VIRTUAL_NUMBER': 'client_credentials',
  'ACCOUNT_ID': 'client_credentials',
  'E911': 'client_credentials',
  'REFRESH': 'refresh_token'
};

function getGrantType(app_scope) {
  if (undefined !== grantTypesMap) {
    return grantTypesMap[app_scope];
  }
}

function getScope(app_scope) {
  if (undefined !== config
      && undefined !== config.info
      && undefined !== config.info.scope_map) {
    return config.info.scope_map[app_scope];
  }
}

/**
 * @public
 * @function
 * configure
 * @summary
 * Configures application with provided AT&T key and secret any any additional information
 * @desc
 * A DHS method to configure application with the passed AT&T
 * application key and secret and any additional information
 *
 * @param {object} options
 * @param {string} options.app_key - AT&T application key.
 * @param {string} options.app_secret - AT&T application secret.
 * @param {string} [options.virtual_numbers_pool] - Array pool of virtual numbers.
 * @param {string} [options.ewebrtc_domain] - AT&T EWebRTC domain.
 *
 * @example
 * var myDHS = require("att-dhs"),
 * options = {
 *   app_key: '<your-app-key>',
 *   app_secret: '<your-app-secret>',
 * };
 *
 * myDHS.configure(options);
 * 
 * @example
 * var myDHS = require("att-dhs"),
 * options = {
 *   app_key: '<your-app-key>',
 *   app_secret: '<your-app-secret>',
 *   virtual_numbers_pool: ['1234567890', '9876543210'],
 *   ewebrtc_domain: '<your-domain-name>'
 * };
 *
 * myDHS.configure(options);
 *
 * @example
 * // providing <your_app_url> with /tokens and /e911ids endpoints
 * var myDHS = require("att-dhs");
 * options = {
 *   app_key: '<your-app-key>',
 *   app_secret: '<your-app-secret>',
 *   virtual_numbers_pool: ['1234567890', '9876543210'],
 *   ewebrtc_domain: '<your-domain-name>',
 *   app_token_uri: '<your_app_url>/tokens',
 *   app_e911ids_uri: '<your_app_url>/e911ids'
 * };
 *
 * myDHS.configure(options);
 */

function configure(options) {
  console.info('dhs.config: configure');
  console.info('options:', options);

  if (undefined === options
      || Object.keys(options).length === 0) {
    throw new Error('No options provided');
  }

  if (undefined === options.app_key) {
    throw new Error('No app_key provided');
  }

  if (undefined === options.app_secret) {
    throw new Error('No app_secret provided');
  }

  var key;

  if ('object' !== typeof config) {
    config = {};
  }

  if ('object' !== typeof config.info) {
    config.info = {};
  }

  for (key in options) {
    if (options.hasOwnProperty(key)) {
      if ('api_env' === key
          || 'token_uri' === key
          || 'ewebrtc_uri' === key
          || 'scope_map' === key
          || 'e911id_uri' === key) {
        config.info[key] = options[key];
      } else {
        config[key] = options[key];
      }
    }
  }

  config.info.dhs_name = pkg.name;
  config.info.dhs_version = pkg.version;
}

/**
 * @public
 * @function
 * getConfiguration
 * @summary
 * Returns the environment configuration.
 * @desc
 * A DHS method to return environment configuration like `app_key`, `virtual_numbers_pool`
 * and `ewebrtc_domain`
 *
 * @example
 * var myDHS = require("att-dhs"),
 * config = myDHS.getConfiguration();
 *
 * @returns {EnvConfig}
 */
function getConfiguration() {
  console.log('dhs.config: getConfiguration');

  var key,
    result;

  result = {};

  for (key in config) {
    if (config.hasOwnProperty(key)) {
      if (key !== 'app_secret') {
        result[key] = config[key];
      }
    }
  }

  console.info('result:', result);

  /**
   *  @typedef {Object} EnvConfig
   *
   *  @property {String} app_key 'thirty_two_character_application_key'
   *  @property {String} api_endpoint API endpoint e.g. 'https://api.att.com'
   *  @property {String} ewebrtc_uri EWebRTC domain e.g. '/RTC/v1'
   *  @property {Array} virtual_numbers_pool Virtual number e.g. ['1234567890', '9876543210']
   *  @property {String} ewebrtc_domain EWebRTC domain e.g. 'yourdomain.com'
   */
  return result;
}

function getAppConfiguration() {
  return config;
}

exports.config = {
  configure: configure,
  getConfiguration: getConfiguration,
  getAppConfiguration: getAppConfiguration,
  getGrantType: getGrantType,
  getScope: getScope
};
