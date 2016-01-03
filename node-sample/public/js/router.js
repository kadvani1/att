/*jslint browser: true, devel: true, node: true, debug: true, todo: true, indent: 2, maxlen: 150*/
/*global ajaxRequest, loadDefaultView
*/

'use strict';
var myDHS = 'https://127.0.0.1:9001',
  config,
  virtual_numbers,
  ewebrtc_domain;

function loadConfiguration(callback) {
  var xhrConfig = new XMLHttpRequest();
  xhrConfig.open('GET', myDHS + "/config/");
  xhrConfig.onreadystatechange = function () {
    if (xhrConfig.readyState === 4) {
      if (xhrConfig.status === 200) {
        config = JSON.parse(xhrConfig.responseText);
        console.log(config);
        virtual_numbers = config.virtual_numbers_pool;
        ewebrtc_domain = config.ewebrtc_domain;
        callback();
      } else {
        console.error(xhrConfig.responseText);
      }
    }
  };
  xhrConfig.send();
}

// ### Create Access Token
function createAccessToken(appScope, authCode, success, error) {
  var xhrToken = new XMLHttpRequest();

  xhrToken.open('POST', config.app_token_url);
  xhrToken.setRequestHeader("Content-Type", "application/json");
  xhrToken.onreadystatechange = function () {
    if (xhrToken.readyState === 4) {
      if (xhrToken.status === 200) {
        success(JSON.parse(xhrToken.responseText));
      } else {
        error(xhrToken.responseText);
      }
    }
  };
  xhrToken.send(JSON.stringify({app_scope: appScope, auth_code: authCode}));
}

// ### Create e911 id
function createE911Id(accessToken, address, is_confirmed, success, error) {
  var xhrE911 = new XMLHttpRequest();

  xhrE911.open('POST', config.app_e911id_url);
  xhrE911.setRequestHeader("Content-Type", "application/json");
  xhrE911.onreadystatechange = function () {
    if (xhrE911.readyState === 4) {
      if (xhrE911.status === 200) {
        success(JSON.parse(xhrE911.responseText));
      } else {
        error(xhrE911.responseText);
      }
    }
  };
  xhrE911.send(JSON.stringify({token: accessToken, address: address, is_confirmed: is_confirmed}));
}

// ### Create redirect_uri
function mobileNumberLogin() {
  // Attempt to authorize your mobile to make Enhanced WebRTC calls
  //window.location.href = myDHS + '/oauth/authorize?redirect_uri=' + window.location.href + 'consent.html';
  if (config.info.dhs_platform === 'PHP') { //Use PHP DHS Unverisal OAuth Callback
    window.location.href = config.oauth_callback + '?redirect_uri=' + window.location.href + '/consent.html';
  } else { //Use App specific OAuth Callback
    window.location.href = 'https://api.att.com/oauth/v4/authorize?client_id=' + config.app_key +
      '&scope=WEBRTCMOBILE&redirect_uri=' + window.location.href + '/consent.html';
  }
}
