// # AT&T's Enhanced WebRTC Javascript SDK tutorial
// ---------------------------------

// ## JSLint configuration
// --------------

/*jslint browser: true, devel: true, node: true, debug: true, todo: true, indent: 2, maxlen: 150*/

// Make JSLint aware of variables and functions that are defined in other files.
/*global ATT, unsupportedBrowserError, loadSampleApp, checkEnhancedWebRTCSession, addCall,
  onSessionReady, onSessionDisconnected, onSessionExpired, onAddressUpdated, onError, onWarning, onDialing,
  onIncomingCall, onConnecting, onCallConnected, onMediaEstablished, onEarlyMedia, onAnswering, onCallMuted,
  onCallUnMuted, onCallHeld, onCallResumed, onCallDisconnecting, onCallDisconnected, onCallCanceled,
  onCallRejected, onConferenceConnected, onConferenceDisconnected, onConferenceInvite, onConferenceCanceled,
  onConferenceEnded, onJoiningConference, onInvitationSent, onInviteAccepted, onInviteRejected,
  onParticipantRemoved, onConferenceDisconnecting, onConferenceHeld, onConferenceResumed, onNotification,
  onCallSwitched, onCallRingBackProvided, onTransferring, onTransferred, onCallMoved, onMediaModification,
  onStateChanged, onModificationInProgress, onToneSent, onToneSending, onGatewayUnreachable*/

'use strict';

var phone,
  version,
  bWebRTCSupportExists;

// ### Check if the current browser has WebRTC capability
// ---------------------------------
//Check to see whether browser [**has WebRTC**](../../lib/webrtc-sdk/doc/ATT.browser.html#hasWebRTC) support using Media Service API
bWebRTCSupportExists = ('Not Supported' !== ATT.browser.hasWebRTC());

if (!bWebRTCSupportExists) {
  throw unsupportedBrowserError();
}

// ### Client code snippets for routes
// ---------------------------------
//
// #### Get app configuration
//
// **Example 1:** Getting **virtual numbers** list
//
// <pre>
//  function setDropdownData(virtualNumbers) {
//    var virtualNumbersDropdown;
//
//    virtualNumbersDropdown =
//      document.getElementById("virtual-numbers");
//
//    for (var i=0; i < virtual_numbers.length; i++) {
//      addOption(virtualNumberDropdown, virtualNumbers[i]);
//    }
//  }
//
//  var xhrConfig = new XMLHttpRequest();
//  xhrConfig.open('GET', '/config');
//  xhrConfig.onreadystatechange = function() {
//    if (xhrConfig.readyState == 4) {
//        if (xhrConfig.status == 200) {
//            var config = JSON.parse(xhrConfig.responseText);
//            virtualNumbers = config.virtual_numbers_pool;
//            setDropdownData(virtualNumbers)
//        } else {
//            console.log(xhrConfig.responseText);
//        }
//     }
//  }
//  xhrConfig.send();
//
// </pre>
//
// **Example 2:** Getting domain name for **account id** users
//
// <pre>
//  function displayAccountId(accountIdDomain) {
//    var userIdElement,
//        userId;
//
//    userId = document.getElementById("user-id").value;
//    userIdElement = document.getElementById("account-id");
//
//    userIdElement.innerHTML = userId +
//                              "@" + accountIdDomain;
//  }
//
//  var xhrConfig = new XMLHttpRequest();
//  xhrConfig.open('GET', '/config');
//  xhrConfig.onreadystatechange = function() {
//    if (xhrConfig.readyState == 4) {
//      if (xhrConfig.status == 200) {
//         var config = JSON.parse(xhrConfig.responseText);
//         ewebrtc_domain = config.ewebrtc_domain;
//         displayAccountId(ewebrtc_domain);
//      } else {
//         console.log(xhrConfig.responseText);
//      }
//    }
//  }
//  xhrConfig.send();
//
// </pre>
//
// #### Creating Access Token
//
// **Example 1:** Create access token as a **mobile number** user
//
// <pre>
//  function success(data) {
//    // do something ...
//  }
//
//  function error(errorData) {
//    // do something ...
//  }
//
//  var xhrToken = new XMLHttpRequest();
//  xhrToken.open('POST', '/tokens');
//  xhrToken.setRequestHeader("Content-Type", "application/json");
//  xhrToken.onreadystatechange = function() {
//    if (xhrToken.readyState == 4) {
//      if (xhrToken.status == 200) {
//        success(JSON.parse(xhrToken.responseText));
//      } else {
//        error(xhrToken.responseText);
//      }
//    }
//  }
//  xhrToken.send(JSON.stringify({
//    app_scope: "MOBILE_NUMBER",
//    auth_code: "authorization_code"
//  }));
//
// </pre>
//
// **Example 2:** Create access token as a **virtual number** user
//
// <pre>
//  function success(data) {
//    // do something ...
//  }
//
//  function error(errorData) {
//    // do something ...
//  }
//
//  var xhrToken = new XMLHttpRequest();
//  xhrToken.open('POST', '/tokens');
//  xhrToken.setRequestHeader("Content-Type", "application/json");
//  xhrToken.onreadystatechange = function() {
//    if (xhrToken.readyState == 4) {
//      if (xhrToken.status == 200) {
//        success(JSON.parse(xhrToken.responseText));
//      } else {
//        error(xhrToken.responseText);
//      }
//    }
//  }
//  xhrToken.send(JSON.stringify({
//    app_scope: "VIRTUAL_NUMBER"
//  }));
//
// </pre>
//
// **Example 3:** Create access token as an **account id** user
//
// <pre>
//  function success(data) {
//    // do something ...
//  }
//
//  function error(errorData) {
//    // do something ...
//  }
//
//  var xhrToken = new XMLHttpRequest();
//  xhrToken.open('POST', '/tokens');
//  xhrToken.setRequestHeader("Content-Type", "application/json");
//  xhrToken.onreadystatechange = function() {
//    if (xhrToken.readyState == 4) {
//      if (xhrToken.status == 200) {
//        success(JSON.parse(xhrToken.responseText));
//      } else {
//        error(xhrToken.responseText);
//      }
//    }
//  }
//  xhrToken.send(JSON.stringify({
//    app_scope: "ACCOUNT_ID"
//  }));
//
// </pre>
//
// #### Creating e911 id
//
// The e911id can only be created for **mobile number** users or **virtual number** users.
//
// **Example**
//
// <pre>
//  function success(data) {
//    // do something ...
//  }
//
//  function error(errorData) {
//    // do something ...
//  }
//
//  var xhrE911 = new XMLHttpRequest();
//  xhrE911.open('POST', '/e911ids');
//  xhrE911.setRequestHeader("Content-Type", "application/json");
//  xhrE911.onreadystatechange = function() {
//    if (xhrE911.readyState == 4) {
//      if (xhrE911.status == 200) {
//        success(JSON.parse(xhrE911.responseText));
//      } else {
//        error(xhrE911.responseText);
//      }
//    }
//  }
//  xhrE911.send(JSON.stringify({
//    token: accessToken,
//    address: address,
//    is_confirmed: false
//  }));
//
// </pre>
//
// ## The Phone Object
// -----------
// Every action for Call & Conference Management is done
// via the Phone's interface.

// ### Getting the phone object
// ---------------------------------
// Phone object is the main interface for making a call.
// This will be our instance of the Phone object.
phone = ATT.rtc.Phone.getPhone();

// ### Getting the SDK version number
// -----------------------------
// Once you have the phone object, you can use the
// [**phone.getVersion**](../../lib/webrtc-sdk/doc/Phone.html#getVersion) method on the Phone object to get the version number
// of the SDK.

version = phone.getVersion();
document.getElementById('version').innerHTML = version;

// ## Error Handling
// -----------------
// All errors during the usage of the Phone object are published
// via the [**error**](../../lib/webrtc-sdk/doc/Phone.html#event:error) event.

// ### Registering for _error_ event
// ---------------------------------
// Here the [**error**](../../lib/webrtc-sdk/doc/Phone.html#event:error) event is published after receiving an error
//
// **Callback function example:**
//
// <pre>
// function onError(data) {
//   error = data.error
// }
// </pre>
phone.on('error', onError);

// ## Warning Handling
// -----------------
// All warnings during the usage of the Phone object are published
// via the [**warning**](../../lib/webrtc-sdk/doc/Phone.html#event:warning) event.

// ### Registering for _warning_ event
// ---------------------------------
// Here the [**warning**](../../lib/webrtc-sdk/doc/Phone.html#event:warning) event is published after receiving a warning
//
// **Callback function example:**
//
// <pre>
// function onWarning(data) {
//   var message = data.message;
// }
// </pre>
phone.on('warning', onWarning);

// # Session Management

// ## Login to Enhanced WebRTC
// ### Register for _address updated_ event
// ---------------------------------
// The [**address-updated**](../../lib/webrtc-sdk/doc/Phone.html#event:address-updated) event is published after successfully updating your E911 ID.
//
// **Callback function example:**
//
// <pre>
// function onAddressUpdated(data) {
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('address-updated', onAddressUpdated);

// ### Register for _session:ready_ event
// ---------------------------------
// The [**session:ready**](../../lib/webrtc-sdk/doc/Phone.html#event:session:ready) event is published after
// successfully logged in to the Enhanced WebRTC.
// This event indicates that the SDK is ready to make or receive calls.
//
// **Callback function example:**
//
// <pre>
// function onSessionReady(data) {
//   sessionId = data.sessionId;
//   profile = data.name;
//   userid = data.userid;
//   type = data.type;
//   message = data.message;
// }
// </pre>
phone.on('session:ready', onSessionReady);

// ### Register for _notification_ event
// ---------------------------------
// The [**notification**](../../lib/webrtc-sdk/doc/Phone.html#event:notification) event publishes SDK notifications
// about the unhandled SDK behavior that is not an error.
//
// **Callback function example:**
//
// <pre>
// function onNotification(data) {
//   message = data.message;
// }
// </pre>
phone.on('notification', onNotification);

// ### Associate Access Token
// ---------------------------------
function associateAccessToken(userId, accessToken, success, error) {
//[**ATT.rtc.associateAccessToken**](../../lib/webrtc-sdk/doc/ATT.rtc.html#associateAccessToken)
// associates an access token to a user id that is needed before you can login.
//
// - `userId` is the user id that you want to associate the access token to
//
// - `token` is the access token you want to associate
//
// - `success` is the success callback
//
// - `error` is the failure callback
  phone.associateAccessToken({
    userId: userId,
    token: accessToken,
    success: success,
    error: error
  });
}

// ### Create Enhanced WebRTC Session
// ---------------------------------
function loginEnhancedWebRTC(token, e911Id) {
//[**phone.login**](../../lib/webrtc-sdk/doc/Phone.html#login) establishes Enhanced WebRTC session so that the user can
// start making Enhanced WebRTC calls.
//
// - `token` is the oAuth token you get from the consent
//
// - `[e911Id]` is e911 address identifier
  phone.login({
    token: token,
    e911Id: e911Id ? e911Id.e911Locations.addressIdentifier : null
  });
}

// ### Updating the address
// ---------------------------------
function associateE911Id(e911Id) {
//Given that the user is logged in, you can use the [**phone.associateE911Id**](../../lib/webrtc-sdk/doc/Phone.html#associateE911Id)
//method to update the user's e911 linked address like:

  phone.associateE911Id({
    e911Id: e911Id
  });
}

// ## Logout from Enhanced WebRTC
// ### Register for _session:disconnected_ event
// ---------------------------------
// The [**session:disconnected**](../../lib/webrtc-sdk/doc/Phone.html#event:session:disconnected) event is published
// after logging out from Enhanced WebRTC session.
// This event is published to indicate that the session was successfully deleted.
phone.on('session:disconnected', onSessionDisconnected);



// ## Session expired from Enhanced WebRTC
// ### Register for _session:expired_ event
// ---------------------------------
// The [**session:expired**](../../lib/webrtc-sdk/doc/Phone.html#event:session:expired) event is published
// when session is expired in the backend.
// This event is published to indicate that there is a session deleted from the backend due to some reason.
phone.on('session:expired', onSessionExpired);

// ## Gateway unreachable   from Enhanced WebRTC
// ### Register for _gateway:unreachable_ event
// ---------------------------------
// The [**gateway:unreachable**](../../lib/webrtc-sdk/doc/Phone.html#event:gateway:unreachable) event is published
// when gateway is unreachable.
// This event is published to indicate the client cannot get connected to the gateway due to some reason.
phone.on('gateway:unreachable', onGatewayUnreachable);

// ### Clear the current Enhanced WebRTC session
// ---------------------------------
function phoneLogout() {
  if (checkEnhancedWebRTCSession()) {
    phone.on('error', function (data) {
      if (data.error && data.error.JSMethod === 'logout') {
        onSessionDisconnected();
      }
    });
//[**phone.logout**](../../lib/webrtc-sdk/doc/Phone.html#logout) logs out the user from Enhanced WebRTC session.
    phone.logout();
  }
}

// # Basic Call Management
// ## Making a call
// ---------------------------------

// A call object will publish various events as it progresses
// through its lifecycle. In order to handle those events you must
// register handlers as follows:

// ### Register for _call:connecting_ event
// ---------------------------------
// Here the [**call:connecting**](../../lib/webrtc-sdk/doc/Phone.html#event:call:connecting) event is published after successfully dialing out.
//
// **Callback function example:**
//
// <pre>
// function onConnecting(data) {
//   to = data.to;
//   mediaType = data.mediaType;
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('call:connecting', onConnecting);

// ### Register for _call:ringback-provided_ event
// ---------------------------------
// Here the [**call:ringback-provided**](../../lib/webrtc-sdk/doc/Phone.html#event:call:ringback-provided) event is
// published if early media (such as a ring-tone) becomes available during the initial call setup.
//
// **Callback function example:**
//
// <pre>
// function onCallRingBackProvided(data) {
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('call:ringback-provided', onCallRingBackProvided);

// ### Register for _call:connected_ event
// ---------------------------------
// The [**call:connected**](../../lib/webrtc-sdk/doc/Phone.html#event:call:connected) event is published when a connection is established
// between two parties.
//
// **Callback function example:**
//
// <pre>
// function onCallConnected(data) {
//   mediaType = data.mediaType;
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('call:connected', onCallConnected);

// ### Register for _media:established_ event
// ---------------------------------
// The [**media:established**](../../lib/webrtc-sdk/doc/Phone.html#event:media:established) event is published when media begins to play.
//
// **Callback function example:**
//
// <pre>
// function onMediaEstablished(data) {
//   to = data.to;
//   mediaType = data.mediaType;
//   timestamp = data.timestamp;
//   codec = data.codec;
// }
// </pre>
phone.on('media:established', onMediaEstablished);

// ### Register for _call:disconnected_ event
// ---------------------------------
// The [**call:disconnected**](../../lib/webrtc-sdk/doc/Phone.html#event:call:disconnected) event is published after
// successfully disconnecting the call.
phone.on('call:disconnected', onCallDisconnected);


// ### Register for _call:canceled_ event
// ---------------------------------
// The [**call:canceled**](../../lib/webrtc-sdƒk/doc/Phone.html#event:call:canceled) event is published after
// successfully canceling a call.
//
// **Callback function example:**
//
// <pre>
// function onCallCanceled(data) {
//   to = data.to;
//   mediaType = data.mediaType;
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('call:canceled', onCallCanceled);


// ### Register for _dialing_ event
// ---------------------------------
// The [**dialing**](../../lib/webrtc-sdk/doc/Phone.html#event:dialing) event is published immediately after dial method is invoked.
phone.on('dialing', onDialing);

// ### Dialing
// ---------------------------------

function dial(destination, mediaType, localMedia, remoteMedia) {

// Once you have registered handlers for all appropriate
// events you can use the [**phone.dial**](../../lib/webrtc-sdk/doc/Phone.html#dial) method on Phone to start a call.

  // If there's already a call in progress
  if (phone.isCallInProgress()) {
    // handle this call with the [**phone.addCall**](../../lib/webrtc-sdk/doc/Phone.html#addCall) method
    addCall(destination, mediaType, localMedia, remoteMedia);
  } else {
    // otherwise just the [**phone.dial**](../../lib/webrtc-sdk/doc/Phone.html#dial) method. You need to pass:
    phone.dial({
      // - a valid Mobile Number, Account ID, Virtual Number user identifier, e.g.:
      //   * `11231231234`,
      //   * `123*321-1234`
      //   * `user@domain.com`
      //   * `1800CALLFED`
      //   * `911`

      destination: destination,
      // - a valid call type:
      //   * `audio` for audio-only calls and
      //   * `video` for video calls
      mediaType: mediaType,
      // - the `HTMLVideoElement` to use for the local stream,
      localMedia: localMedia,
      // - and the `HTMLVideoElement` to use for the remote stream.
      remoteMedia: remoteMedia
    });
  }
}

// ## Receiving calls
// ### Register for _call:incoming_ event
// ---------------------------------

// In order to handle incoming calls, you need to register
// a handler for the [**call:incoming**](../../lib/webrtc-sdk/doc/Phone.html#event:call:incoming) event on the Phone object.

phone.on('call:incoming', onIncomingCall);

// You also need to register handlers for the other events that
// are published during the process of answering a call.

// ### Register for _answering_ event
// ---------------------------------
// The [**answering**](../../lib/webrtc-sdk/doc/Phone.html#event:answering) event is published immediately when the other party answers the call
phone.on('answering', onAnswering);

// ### Answer an incoming call
// --------------

function answer(localMedia, remoteMedia) {
  // Once you have registered to receive calls, you can use the
  // [**phone.answer**](../../lib/webrtc-sdk/doc/Phone.html#answer) method on the Phone object to answer an incoming call,
  // it receives:
  phone.answer({
    // - the `HTMLVideoElement` object to use for the local stream
    localMedia: localMedia,
    // - the `HTMLVideoElement` object to use for the remote stream.
    remoteMedia: remoteMedia
  });
}

// ## Managing a second call
// Once a call is in progress, you can make a second call or receive
// a second incoming call. Use [**phone.isCallInProgress**](../../lib/webrtc-sdk/doc/Phone.html#isCallInProgress) to
// check whether there is a call in progress.

// ### Making a second call
// --------------

// The second call will publish the same events that we have already covered in previous
// sections of the tutorial.

function addCall(callee, mediaType, localMedia, remoteMedia) {

  // Use the [**phone.addCall**](../../lib/webrtc-sdk/doc/Phone.html#addCall) method to make a second call when there is a first call in progress.
  // You need to pass:
  phone.addCall({
    // - a valid Mobile Number, Account ID, Virtual Number user identifier, e.g.:
    //   * `11231231234`,
    //   * `123*321-1234`
    //   * `user@domain.com`
    //   * `1800CALLFED`
    //   * `911`
    destination: callee,
    // - a valid call type:
    //   * `audio` for audio-only calls and
    //   * `video` for video calls
    mediaType: mediaType,
    // - the `HTMLVideoElement` to use for the local stream,
    localMedia: localMedia,
    // - and the `HTMLVideoElement` to use for the remote stream.
    remoteMedia: remoteMedia
  });
}

// ### Answering a second call
// --------------

// Once you have an active call, you can handle a second incoming call using the
// [**phone.answer**](../../lib/webrtc-sdk/doc/Phone.html#answer) method.

function answer2ndCall(localMedia, remoteMedia, action) {
  // The [**phone.answer**](../../lib/webrtc-sdk/doc/Phone.html#answer) method receives:
  phone.answer({
    // - the `HTMLVideoElement` object to use for the local stream
    localMedia: localMedia,
    // - the `HTMLVideoElement` object to use for the remote stream.
    remoteMedia: remoteMedia,
    // - an optional `action` (`hold` or `end`) to indicate whether to hold or end the current call.
    // Use [**phone.isCallInProgress**](../../lib/webrtc-sdk/doc/Phone.html#isCallInProgress) to check whether there is a call in progress.
    action: action
  });
}

// ## Operations for ongoing calls
// Once a call is ongoing, you can perform basic operations with
// them like muting, unmuting, holding, resuming, canceling and hanging up.

// ### Rejecting incoming calls
// ---------------------------------
// Register for [**call:rejected**](../../lib/webrtc-sdk/doc/Phone.html#event:call:rejected) event, it is published the call
// is rejected by the receiving party
phone.on('call:rejected', onCallRejected);

function reject() {
  // Use the [**phone.reject**](../../lib/webrtc-sdk/doc/Phone.html#reject) method to reject the incoming call
  phone.reject();
}

// ### Muting the call
// ---------
// Register for [**call:muted**](../../lib/webrtc-sdk/doc/Phone.html#event:call:muted) event,
// it is published when [**phone.mute**](../../lib/webrtc-sdk/doc/Phone.html#mute) is invoked
phone.on('call:muted', onCallMuted);

function mute() {
  // Then use the [**phone.mute**](../../lib/webrtc-sdk/doc/Phone.html#mute) method to mute the current call.
  phone.mute();
}

// ### Unmute a call
// ---------------------------------

// Register for [**call:unmuted**](../../lib/webrtc-sdk/doc/Phone.html#event:call:unmuted) event, it is
// published when [**phone.unmute**](../../lib/webrtc-sdk/doc/Phone.html#unmute) is invoked.
phone.on('call:unmuted', onCallUnMuted);

function unmute() {
  // Use the [**phone.unmute**](../../lib/webrtc-sdk/doc/Phone.html#unmute) method to unmute the current call
  phone.unmute();
}

// ### Put a call on hold
// ---------------------------------
// Register for [**call:held**](../../lib/webrtc-sdk/doc/Phone.html#event:call:held) event, it is published when call is on hold.
phone.on('call:held', onCallHeld);

function hold() {
  // Use the [**phone.hold**](../../lib/webrtc-sdk/doc/Phone.html#hold) method to put the current call or conference on hold.
  phone.hold();
}

// ### Resume a call that is on hold
// ---------------------------------
// Register for [**call:resumed**](../../lib/webrtc-sdk/doc/Phone.html#event:call:resumed) event, it is published when
// [**phone.resume**](../../lib/webrtc-sdk/doc/Phone.html#resume) is invoked
phone.on('call:resumed', onCallResumed);

function resume() {
  // Use the [**phone.resume**](../../lib/webrtc-sdk/doc/Phone.html#resume) method to resume the current call or conference.
  phone.resume();
}

// ### Cancel an outgoing call
// ---------------------------------
function cancel() {
  // Use the [**phone.cancel**](../../lib/webrtc-sdk/doc/Phone.html#cancel) method to cancel the outgoing call.
  phone.cancel();
}

// ### Hangup a call
// ---------------------------------
// Register for [**call:disconnecting**](../../lib/webrtc-sdk/doc/Phone.html#event:call:disconnected) event, it is published
// immediately after invoking [**phone.hangup**](../../lib/webrtc-sdk/doc/Phone.html#hangup)
phone.on('call:disconnecting', onCallDisconnecting);

function hangupCall() {
  //  Use the [**phone.hangup**](../../lib/webrtc-sdk/doc/Phone.html#hangup) method to hang up the current call.
  phone.hangup();
}

// # Advanced Call Management

// ### Move a call to a different client
// -------------------------------------
// Use the [**phone.move**](../../lib/webrtc-sdk/doc/Phone.html#move) method to move the call to another client.
// All clients currently logged in with the same Id will receive a call.
// This method can also be used to move a call to a handheld device.

// ### Register for _call:moved_ event
// ---------------------------------
// The `call:moved` event is published after a call has been successfully moved
//
// **Callback function example:**
//
// <pre>
// function onCallMoved(data) {
//   from = data.from;
//   to = data.to;
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('call:moved', onCallMoved);

function move() {
  // The other devices will start ringing, i.e., the [**Phone**](../../lib/webrtc-sdk/doc/Phone.html) object in the other
  // clients will emit a [**call:incoming**](../../lib/webrtc-sdk/doc/Phone.html#event:call:incoming).
  // [**Phone**](../../lib/webrtc-sdk/doc/Phone.html) will emit the same events as if it was a regular call.
  phone.move();

}

// ### Register for _session:call-switched_ event
// ---------------------------------
// The [**session:call-switched**](../../lib/webrtc-sdk/doc/Phone.html#event:session:call-switched) event is published
// when the current active call is switched
//
// **Callback function example:**
//
// <pre>
// function onCallSwitched(data) {
//   from = data.from;
//   to = data.to;
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('session:call-switched', onCallSwitched);

// ### Switch between two calls or conferences.
// -------------------------------------
// Use the [**phone.switchCall**](../../lib/webrtc-sdk/doc/Phone.html#switchCall) method to switch between two ongoing calls/conferences.
function switchCalls() {
  // The foreground call/conference wil be put on hold and will be moved to background,
  // and the background call/conference will be brought to foreground.
  phone.switchCall();
}


// ### Register for _call:transferring_ event
// ---------------------------------
// The `call:transferring` event is published when call transfer is initiated
//
// **Callback function example:**
//
// <pre>
// function onTransferring(data) {
//   from = data.from;
//   to = data.to;
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('call:transferring', onTransferring);

// ### Register for _call:transferred_ event
// ---------------------------------
// The `call:transferred` event is published after a call has been successfully transferred
//
// **Callback function example:**
//
// <pre>
// function onTransferred(data) {
//   from = data.from;
//   to = data.to;
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('call:transferred', onTransferred);

// ### Transfer one call to another
// -----------------------------------------
function transfer() {
  // Use the [**phone.transfer**](../../lib/webrtc-sdk/doc/Phone.html#transfer) method to transfer existing call to another
  phone.transfer();
}

// ## Changing the media in a call a.k.a. media modifications
// ----------------------------------
//
// If Bob and Alice are in a call, then they may want to change their media constraints:
// * Downgrading a call means the user wants to stop sending their video if in a video call.
// * Upgrading a call means the user wants to start sending their video if in an audio-only call.

// ### Events during media modifications
// ---------------------------------------

// Before a user can start processing media modifications they need to register to the
// [**call:media-modification**](../../lib/webrtc-sdk/doc/Phone.html#event:call:media-modification),
// [**call:modification-in-progress**](../../lib/webrtc-sdk/doc/Phone.html#event:call:modification-in-progress)
// and [**call:state-changed**](../../lib/webrtc-sdk/doc/Phone.html#event:call:state-changed) events.

phone.on('call:modification-in-progress', onModificationInProgress);
phone.on('call:media-modification', onMediaModification);
phone.on('call:state-changed', onStateChanged);

// * `call:modification-in-progress` indicates that the media modification is taking place but has not completed.
// * `call:media-modification` is only fired for the user receiving the modification request when user consent is necessary.
// * `call:state-changed` is fired for both users when the modification is complete.

// ### Downgrade a video call
// -----------------------------------------
// If Bob and Alice are in a video call, then Alice can disable her video and start sending only her audio.
function downgrade() {
  // In order to stop sending her video Alice can use the
  // [**phone.downgrade**](../../lib/webrtc-sdk/doc/Phone.html#downgrade) method.
  phone.downgrade();

  // At this point Bob will receive the `call:media-modification` event and may be promted to 
  // accept or reject depending on the current state of his media.
  //
  // If the downgrade is successfull, then:
  // * Bob and Alice will receive a [**call:state-changed**](../../lib/webrtc-sdk/doc/Phone.html#event:call:state-changed)
  // event indicating the downgrade is complete.
  // * Alice will stop sending her video and Bob will no longer see Alice's video.
}

// ### Upgrade a video call
// -----------------------------------------
// If Bob and Alice are in an audio-only call, then Bob can request to upgrade the call to video.
function upgrade() {
  // In order to start the upgrade Bob will use the
  // [**phone.upgrade**](../../lib/webrtc-sdk/doc/Phone.html#upgrade) method.
  phone.upgrade();
  // At this point Alice will receive the 
  // [**call:media-modification**](../../lib/webrtc-sdk/doc/Phone.html#event:call:media-modification) 
  // event, which this application uses to prompt Alice for confirmation.
  //
  // If the upgrade is successful, then:
  // * Bob and Alice will receive a [**call:state-changed**](../../lib/webrtc-sdk/doc/Phone.html#event:call:state-changed)
  // * Bob will start sending his video and Alice will now see Bob's video.

}

// ### Accepting a media modification
// ------------------------------------
// If Bob is in a call with Alice and he receives a media modification request
// from from Alice, the `call:media-modification` event will fire.
function acceptModification() {

  // In order to accept the modification request, Bob can use the 
  // [**phone.acceptModification**](../../lib/webrtc-sdk/doc/Phone.html#acceptModification) method.
  phone.acceptModification();

  // After successfully accepting the modification, then:
  // * The `call:state-changed` event will fire for both users.
  // * Alice will start sending her new media -- audio for a downgrade, video for an upgrade --.
  // * Bob will update his media constraints to match those of Alice.
  // * Accepting a media modification will make both users have the same media constraints.
}

// ### Rejecting a media modification
// -----------------------------------------
// If Bob is in a call with Alice and he receives a media modification request
// from from Alice, the `call:media-modification` event will fire.
function rejectModification() {
  // In order to reject the modification request, Bob can use the 
  // [**phone.rejectModification**](../../lib/webrtc-sdk/doc/Phone.html#rejectModification) method.
  phone.rejectModification();

  // After successfully rejecting the modification, then:
  // * The `call:state-changed` event will fire for both users.
  // * Alice will start sending her new media -- audio for a downgrade, video for an upgrade --.
  // * Bob will not update his media constraints, he will keep sending whatever he was sending 
  // before the media modification.
}


// # Conference Management

// ## Creating a conference (Host)
// A conference will publish various events as it progresses its lifecycle.
// In order to handle those events you must register handlers as follows:

// ### Register for _conference:connecting_ event
// -----------------------------------------------
// Here the [**conference:connecting**](../../lib/webrtc-sdk/doc/Phone.html#event:conference:connecting) event
// is published while starting a conference.
//
// **Callback function example:**
//
// <pre>
// function onConnecting(data) {
//   to = data.to;
//   mediaType = data.mediaType;
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('conference:connecting', onConnecting);

// ### Register for _conference:connected_ event
// ---------------------------------
// The [**conference:connected**](../../lib/webrtc-sdk/doc/Phone.html#event:conference:connected) event is published
// when the conference has been created or joined.
//
// **Callback function example:**
//
// <pre>
// function onConferenceConnected(data) {
//   mediaType = data.mediaType;
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('conference:connected', onConferenceConnected);

// ### Register for _conference:canceled_ event
// ---------------------------------
// The [**conference:canceled**](../../lib/webrtc-sdk/doc/Phone.html#event:conference:canceled) event is published after
// the conference is canceled.
//
// **Callback function example:**
//
// <pre>
// function onConferenceCanceled(data) {
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('conference:canceled', onConferenceCanceled);

// ### Register for _conference:ended_ event
// ---------------------------------
// The [**conference:ended**](../../lib/webrtc-sdk/doc/Phone.html#event:conference:ended) event is published after
// successfully ending the conference.
//
// **Callback function example:**
//
// <pre>
// function onConferenceEnded(data) {
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('conference:ended', onConferenceEnded);

//  ### Register for _conference:held_ event
// ---------------------------------
// The [**conference:held**](../../lib/webrtc-sdk/doc/Phone.html#event:conference:held) event is published after a
// conference is successfully put on hold.
//
// **Callback function example:**
//
// <pre>
// function onConferenceHeld(data) {
//   mediaType = data.mediaType;
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('conference:held', onConferenceHeld);

// ### Register for _conference:resumed_ event
// ---------------------------------
// The [**conference:resumed**](../../lib/webrtc-sdk/doc/Phone.html#event:conference:resumed) event is published when
// a conference is successfully resumed.
//
// **Callback function example:**
//
// <pre>
// function onConferenceResumed(data) {
//   mediaType = data.mediaType;
//   timestamp = data.timestamp;
// }
// </pre>
phone.on('conference:resumed', onConferenceResumed);

// ## Starting the conference
// ---------------------------------

function startConference(mediaType, localMedia, remoteMedia) {
  // Once you have registered handlers for all appropriate
  // events you can use the [**phone.startConference**](../../lib/webrtc-sdk/doc/Phone.html#startConference) method to create
  // a conference. You must pass:

  phone.startConference({
    // a valid media type for this conference:
    // * `audio` for audio-only calls and
    // * `video` for video calls
    mediaType: mediaType,
    // the `HTMLVideoElement` to use for the local stream,
    localMedia: localMedia,
    // and the `HTMLVideoElement` to use for the remote stream.
    remoteMedia: remoteMedia
  });
}

// ## Receiving Conference Invites
// In order to handle conference invites, you must register for the
// following events on the Phone object:

// ### Register for _conference:invitation-received_ event
// ---------------------------------
// The [**conference:invitation-received**](../../lib/webrtc-sdk/doc/Phone.html#event:conference:invitation-received)
// event is published when the other party receives invitation
//
phone.on('conference:invitation-received', onConferenceInvite);

// ### Register for _conference:joining_ event
// ---------------------------------
// The [**conference:joining**](../../lib/webrtc-sdk/doc/Phone.html#event:conference:joining) event is published
// immediately when the other party accepts to join the conference
phone.on('conference:joining', onJoiningConference);

// ### Joining the conference

function joinConference(localMedia, remoteMedia) {
  // Use the [**phone.joinConference**](../../lib/webrtc-sdk/doc/Phone.html#joinConference) method to join a conference by accepting the invite.
  // You must pass in:
  phone.joinConference({
    // a valid `HTMLVideoElement` for the local media stream and
    localMedia: localMedia,
    // a valid `HTMLVideoElement` for the remote media stream.
    remoteMedia: remoteMedia
  });
}

// ### Joining a second conference
// --------------

// Once you have an active call or conference, you can handle a second incoming conference using the
// [**phone.joinConference**](../../lib/webrtc-sdk/doc/Phone.html#joinConference) method.

function joinSecondConference(localMedia, remoteMedia, action) {
  // The [**phone.joinConference**](../../lib/webrtc-sdk/doc/Phone.html#joinConference) method receives:
  phone.joinConference({
    // - the `HTMLVideoElement` object to use for the local stream
    localMedia: localMedia,
    // - the `HTMLVideoElement` object to use for the remote stream.
    remoteMedia: remoteMedia,
    // - an optional `action` (`hold` or `end`) to indicate whether to hold or end the current call.
    // Use [**phone.isCallInProgress**](../../lib/webrtc-sdk/doc/Phone.html#isCallInProgress) to check whether there is a call in progress.
    action: action
  });
}

// ## Operations during an ongoing Conference
// As the host of a Conference you can perform basic operations with
// them like:
// * adding/removing participants
// * getting the list of participants
// * holding the conference
// * resuming the conference
// * ending the conference

// ### Adding participants to a conference
// ---------------

// First you must register handlers for the events published
// during the process of adding a participant:

// The [**conference:invitation-sent**](../../lib/webrtc-sdk/doc/Phone.html#event:conference:invitation-sent) event
// is published when the invitation was sent successfully.
phone.on('conference:invitation-sent', onInvitationSent);
// The [**conference:invitation-accepted**](../../lib/webrtc-sdk/doc/Phone.html#event:conference:invitation-accepted)
// event is published when the invitation is accepted by the other party.
phone.on('conference:invitation-accepted', onInviteAccepted);
// The [**conference:invitation-rejected**](../../lib/webrtc-sdk/doc/Phone.html#event:conference:invitation-rejected)
// event is published when the invitation is rejected by the other party.
phone.on('conference:invitation-rejected', onInviteRejected);

// Then use the [**phone.addParticipant**](../../lib/webrtc-sdk/doc/Phone.html#addParticipant) method to adds participant, e.g.,
function addParticipant(participant) {
  // ```
  //   phone.addParticipant('11231231234');
  // ```
  phone.addParticipant(participant);
}

// ### Removing Participants
// ---------------------------------

// First register for [**conference:participant-removed**](../../lib/webrtc-sdk/doc/Phone.html#event:conference:participant-removed) event, which
// is published when the participant is successfully removed from the current conference.
phone.on('conference:participant-removed', onParticipantRemoved);

function removeParticipant(participant) {
  // Use the [**phone.removeParticipant**](../../lib/webrtc-sdk/doc/Phone.html#removeParticipant) method with the participant's ID
  // to remove a participant from the current conference, e.g.,
  phone.removeParticipant(participant);
  // ```
  // phone.removeParticipant('john@domain.com');
  // ```
}

// ### Get the list of active participants
// ---------------------------------
function getParticipants() {
  // Use the [**phone.getParticipants**](../../lib/webrtc-sdk/doc/Phone.html#getParticipants) method to get the list of active participants.
  return phone.getParticipants();
}

// ### Rejecting conference invites
// ---------------------------------
function rejectConference() {
  // Use the [**phone.rejectConference**](../../lib/webrtc-sdk/doc/Phone.html#rejectConference) method to reject the incoming conference invite.
  phone.rejectConference();
}

// ### Ending a conference
// ---------------------------------

// Register for [**conference:disconnecting**](../../lib/webrtc-sdk/doc/Phone.html#event:conference:disconnecting) event; it is published
// immediately after invoking [**phone.endConference**](../../lib/webrtc-sdk/doc/Phone.html#endConference).
phone.on('conference:disconnecting', onConferenceDisconnecting);

function endConference() {
  // Use the [**phone.endConference**](../../lib/webrtc-sdk/doc/Phone.html#endConference) method to end the current conference.
  phone.endConference();
}

// # Phone utilities

// The phone object provides utility methods for common tasks related phone number
// parsing and formatting.

// ## Parsing phone numbers
// ---------------------------------
function cleanPhoneNumber(phoneNum) {

  // In order to get the phone number in a format that the library can use to
  // dial, use the [**phone.cleanPhoneNumber**](../../lib/webrtc-sdk/doc/Phone.html#cleanPhoneNumber) method, it will convert numbers like
  // `+1 (123) 123 1234` to `11231231234`,
  // and `1800CALFEDX` to `18002253339`.
  return phone.cleanPhoneNumber(phoneNum);
}

// ## parsing caller info
// ---------------------------------
function getCallerInfo(callerUri) {

  // In order to get the caller information like protocol, caller-id and domain we can use
  // the [**phone.getCallerInfo**](../../lib/webrtc-sdk/doc/Phone.html#getCallerInfo) method,
  // it will convert callerUri like
  // `sip:+1111@icmn.api.att.com` to an object like
  // `{
  //    protocol: 'sip',
  //    callerId: '+1111',
  //    domain: 'icmn.api.att.com'
  // }`.
  return phone.getCallerInfo(callerUri);
}
// ### Ending a Phone utilities
// ---------------------------------


// # DTMF [Dual Tone - Multi Frequency]
// ---------------------------------

// The phone object provides methods to use DTMF functionality when in a call..



// ### Register for _sendDTMFTone_ event
// ---------------------------------

// The [**dtmf:tone-sending**](../../lib/webrtc-sdk/doc/Phone.html#event:dtmf:tone-sending) event is published
// immediately after tone request is sent.
phone.on('dtmf:tone-sending', onToneSending);

// The [**dtmf:tone-sent**](../../lib/webrtc-sdk/doc/Phone.html#event:dtmf:tone-sent) event is published immediately
// after signal is passed into streams successfully.

phone.on('dtmf:tone-sent', onToneSent);


// ### sendDTMFTone
// ---------------------------------
function sendDTMFTone(tone) {
// Once you have registered handlers for all appropriate
// events you can use the [**phone.sendDTMFTone**](../../lib/webrtc-sdk/doc/Phone.html#sendDTMFTone) method on Phone to
// start send a DTMF tone.
  phone.sendDTMFTone({
    // - a valid dial tone [0,1,2,3,4,5,6,7,8,9,*,#]
    input : tone,
    // - a the intertone gap (in ms > 50) [50, 60]
    gap : 60
  });
}
// ### Ending a DTMF 
// ---------------------------------

// ## load the sample app
// ---------------------------------
loadSampleApp();
