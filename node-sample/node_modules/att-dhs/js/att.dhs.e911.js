/*jslint browser: true, devel: true, node: true, debug: true, todo: true, indent: 2, maxlen: 150, unparam: true*/
/*global require, exports*/

'use strict';

var restify = require('restify'),
  config = require('./att.dhs.config.js').config;

/**
 * @public
 * @function
 * createE911Id
 * @summary
 * Creates a new E911 Id using an <code>e911</code> scope access token and an address
 * @desc
 * E911 Id is required for mobile number and virtual number user for creating enhanced webrtc session.
 * Use this function to create an E911 Id that can be used for creating the enhanced webrtc session
 * for mobile number and virtual number users.
 * This method requires an access token obtained using `E911` auth_scope and a physical address with
 * these `string` fields:
 *
 * * First Name
 * * Last Name
 * * House Number
 * * Street
 * * Unit (optional)
 * * City
 * * State
 * * Zip Code
 * * Is Confirmed (True or False)
 *
 * @param {object} options
 * @param {string} options.token - Access Token
 * @param {object} options.address - The user's address
 * @param {string} options.address.first_name - The user's first name
 * @param {string} options.address.last_name - The user's last name
 * @param {string} options.address.house_number - The user's house number
 * @param {string} [options.address.unit] - Unit/Apt./Suite number
 * @param {string} options.address.street - The user's street
 * @param {string} options.address.city - The user's city
 * @param {string} options.address.state - The user's state
 * @param {string} options.address.zip - The user's zip code
 * @param {boolean} options.is_confirmed - Confirm that the address exists (even if not found in the database)
 * @param {function} options.success - The callback that handles the successful response after creating an AT&T E911 Id
 * @param {function} options.error - The callback that handles the generated error.
 *
 * @example
 * // Create E911 id using DHS
 * var myDHS = require("att-dhs"),
 * options = {
 *   token: 'token',
 *   address: {
 *     first_name: 'John',
 *     last_name: 'Doe',
 *     house_number: '1111',
 *     street: 'ABC Street',
 *     city: 'My City',
 *     state: 'My State',
 *     zip: '12345'
 *   },
 *   is_confirmed: 'false',
 *   success: function (result) {
 *      // do something
 *   },
 *   error: function (err) {
 *      // do something
 *   }
 * };
 *
 * myDHS.createE911Id(options);
 */

function createE911Id(options) {
  console.info('dhs.e911: createE911Id');
  console.info('options:', options);

  var envConfig,
    restClient,
    payload;

  envConfig = config.getAppConfiguration();

  if (undefined === envConfig.app_key
      || undefined === envConfig.app_secret) {
    throw new Error('DHS not configured. ' +
      'Please invoke ATT.dhs.configure with your app_key and app_secret');
  }

  if (undefined === options
      || 0 === Object.keys(options).length) {
    throw new Error('No options provided');
  }

  if (undefined === options.token) {
    throw new Error('No access token provided');
  }

  if (undefined === options.address) {
    throw new Error('No address provided');
  }

  if ('object' !== typeof options.address
      || 0 === Object.keys(options.address).length) {
    throw new Error('Invalid address provided');
  }

  if (undefined === options.address.first_name) {
    throw new Error('No first name provided');
  }

  if (undefined === options.address.last_name) {
    throw new Error('No last name provided');
  }

  if (undefined === options.address.house_number) {
    throw new Error('No house number provided');
  }

  if (undefined === options.address.street) {
    throw new Error('No street provided');
  }

  if (undefined === options.address.city) {
    throw new Error('No city provided');
  }

  if (undefined === options.address.state) {
    throw new Error('No state provided');
  }

  if (undefined === options.address.zip) {
    throw new Error('No zip code provided');
  }

  if (undefined === options.is_confirmed) {
    options.is_confirmed = "false";
    console.info('No is_confirmed provided, setting to false');
  }

  if (undefined === options.success) {
    throw new Error('No success callback provided');
  }

  if (undefined === options.error) {
    throw new Error('No error callback provided');
  }

  restClient = restify.createJsonClient({
    url: envConfig.api_endpoint,
    userAgent: envConfig.info.dhs_name,
    accept: 'application/json',
    headers: {
      Authorization: 'bearer ' + options.token
    },
    rejectUnauthorized: false
  });

  payload = {
    e911Context: {
      address: {
        name: options.address.first_name + ' ' + options.address.last_name,
        houseNumber: options.address.house_number,
        houseNumExt: options.address.house_number_ext,
        streetDir: options.address.street_dir,
        streetDirSuffix: options.address.street_dir_suffix,
        street: options.address.street,
        streetNameSuffix: options.address.street_suffix,
        unit: options.address.unit,
        city: options.address.city,
        state: options.address.state,
        zip: options.address.zip,
        addressAdditional: options.address.address_additional,
        comments: options.address.comments
      },
      isAddressConfirmed: options.is_confirmed
    }
  };

  console.info('payload:', payload);

  restClient.post(envConfig.info.e911id_uri, payload,
    function (error, req, res, result) {
      if (undefined !== error &&
          null !== error) {
        console.error('error:', error);
        options.error(error);
        return;
      }
      options.success(result);
    });
}

exports.e911 = {
  createE911Id: createE911Id
};