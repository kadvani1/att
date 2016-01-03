/*jslint browser: true, devel: true, node: true, debug: true, todo: true, indent: 2, maxlen: 150*/
/*global ATT, console, log, virtual_numbers, clearMessage, clearError, show, hide, pauseMedia,
  onSessionDisconnected, validateAddress, associateE911Id, getE911Id, loginVirtualNumberOrAccountIdUser,
  loginEnhancedWebRTC, onError, phoneLogout, loadView, switchView, currentCallType, callExists, dial,
  answer, answer2ndCall, joinSecondConference, hold, resume, mute, unmute, upgrade, downgrade,
  startConference, joinConference, addParticipant, virtual_numbers, getParticipants, removeParticipant,
  move, switchCall, transfer, hangupCall, endConference, cleanPhoneNumber, toggleDialPad,
  dialpad, sendDTMFTone */

'use strict';

var sessionData = {},
  currentConferenceHost = false,
  participantsVisible = false;

function createE911AddressId(event, form) {
  event.preventDefault();

  clearError();

  try {

    if (!sessionData.access_token) {
      switchView('login');
      throw new Error('No access token available to login to Enhanced WebRTC. Please create an access token first');
    }

    var address = validateAddress(form);

    getE911Id(address.base,
      address.is_confirmed,
      function (response) {
        loginEnhancedWebRTC(sessionData.access_token, response);
      },
      onError);

  } catch (err) {
    onError(err);
  }
}

function updateE911AddressId(event, form) {
  event.preventDefault();

  clearError();

  try {
    var address = validateAddress(form);

    getE911Id(address.base,
      address.is_confirmed,
      function (e911Id) {
        associateE911Id(e911Id.e911Locations.addressIdentifier);
      },
      onError);

  } catch (err) {
    onError(err);
  }
}

function loginVirtualNumber(event, form) {
  loginVirtualNumberOrAccountIdUser(event, form, 'VIRTUAL_NUMBER');
}

function loginAccountIdUser(event, form) {
  loginVirtualNumberOrAccountIdUser(event, form, 'ACCOUNT_ID');
}

function hideView(obj) {
  if (!obj) {
    return;
  }
  obj.style.display = 'none';
}

function showLoginForm(form) {
  document.removeEventListener('click', hideView);
  document.addEventListener('click', hideView.bind(null, form));

  form.style.display = 'block';
  form.elements.username.focus();
}

function addOption(select, option, val) {
  var opt = document.createElement('option');
  opt.value = undefined === val ? option : val;
  opt.innerHTML = option;
  select.appendChild(opt);
}

function virtualNumberLogin(e) {
  e.stopPropagation();

  hideView(document.getElementById('login-account-id-form'));

  var i,
    form,
    select;

  form = document.getElementById('login-virtual-number-form');

  if (!form) {
    return;
  }

  if (form.children && form.children.length > 0) {
    for (i = 0; i < form.children.length; i = i + 1) {
      if (form.children[i].name === 'username') {
        select = form.children[i];
        break;
      }
    }
  }

  if (select && select.children.length === 0 && virtual_numbers && virtual_numbers.length > 0) {
    addOption(select, '-select-', '');

    virtual_numbers.forEach(function (virtual_number) {
      addOption(select, virtual_number);
    });
  }

  showLoginForm(form);
}

function accountIdUserLogin(e) {
  e.stopPropagation();

  hideView(document.getElementById('login-virtual-number-form'));

  var form;

  form = document.getElementById('login-account-id-form');

  if (!form) {
    return;
  }

  showLoginForm(form);
}

function updateAddress(e) {
  e.stopPropagation();

  var addressDiv =  document.getElementById("address-box");

  document.removeEventListener('click', hideView);
  document.addEventListener('click', hideView.bind(null, addressDiv));

  addressDiv.style.display = 'block';

  loadView('address', function (response) {
    addressDiv.innerHTML = response.responseText;

    var addressForm = document.getElementById('addressForm');
    if (addressForm) {
      addressForm.onsubmit = function (e) {
        updateE911AddressId(e, addressForm);
      };
    }
  });
}

function logout() {
  if (sessionData.sessionId) {
    phoneLogout();
    return;
  }
  onSessionDisconnected();
}

function clickBtn(event) {

  if (!event || !event.target) {
    return;
  }

  var target = event.target,
    destinationNode,
    id,
    val;

  if ('SPAN' === event.target.nodeName) {
    target = target.parentNode;
  }

  destinationNode = document.getElementById('destination');
  id = target && target.id ? target.id : '';
  val = id.substring('4');

  destinationNode.value = destinationNode.value ? destinationNode.value + val : val;

  if (callExists() && 'call' === currentCallType) {
    sendDTMFTone(val);
  }
}

function dialCall(mediaType) {
  var destinationNode,
    destination,
    localVideo,
    remoteVideo;

  destinationNode = document.getElementById('destination');

  destination = destinationNode.value;

  //util method to clean phone number
  destination = cleanPhoneNumber(destination);

  localVideo = document.getElementById('localVideo');
  remoteVideo = document.getElementById('remoteVideo');

  dial(destination, mediaType, localVideo, remoteVideo);
}

function dialVideo() {
  dialCall('video');
}

function dialAudio() {
  dialCall('audio');
}

function answerCall(action) {
  pauseMedia('ringtone');
  clearMessage();

  var localVideo = document.getElementById('localVideo'),
    remoteVideo = document.getElementById('remoteVideo');

  if (undefined !== action) {
    answer2ndCall(localVideo, remoteVideo, action);
  } else {
    answer(localVideo, remoteVideo);
  }
}

function holdAndAnswer() {
  answerCall('hold');
}

function endAndAnswer() {
  answerCall('end');
}

function updateConference(action) {
  pauseMedia('ringtone');
  clearMessage();

  var localVideo = document.getElementById('localVideo'),
    remoteVideo = document.getElementById('remoteVideo');

  if (undefined !== action) {
    joinSecondConference(localVideo, remoteVideo, action);
  } else {
    joinConference(localVideo, remoteVideo);
  }
}

function holdAndJoin() {
  updateConference('hold');
}

function endAndJoin() {
  updateConference('end');
}

function holdCall() {
  hold();
}

function resumeCall() {
  resume();
}

function muteCall() {
  mute();
}

function unMuteCall() {
  unmute();
}

function upgradeCall() {
  upgrade();
}

function downgradeCall() {
  downgrade();
}

function startConf(mediaType) {
  var localVideo,
    remoteVideo;

  localVideo = document.getElementById('localVideo');
  remoteVideo = document.getElementById('remoteVideo');

  currentConferenceHost = true;

  startConference(mediaType, localVideo, remoteVideo);
}

function startVideoConference() {
  startConf('video');
}

function startAudioConference() {
  startConf('audio');
}

function join() {
  pauseMedia('ringtone');
  clearMessage();

  var localVideo = document.getElementById('localVideo'),
    remoteVideo = document.getElementById('remoteVideo');

  joinConference(localVideo, remoteVideo);
}

function addConfParticipant() {
  var destinationNode,
    destination;

  destinationNode = document.getElementById('destination');

  destination = destinationNode.value;

  //util method to clean phone number
  destination = cleanPhoneNumber(destination);

  addParticipant(destination);
}

function removeUser() {
  var user = event.currentTarget.id;

  removeParticipant(user);
}

function showParticipants() {
  var participants,
    participantsList,
    participant,
    rowDiv,
    participantDiv,
    span;

  participantsList = document.getElementById('participants-list');

  if (!participantsList) {
    return;
  }

  participants = getParticipants();

  participantsList.innerHTML = '';

  for (participant in participants) {
    if (participants.hasOwnProperty(participant)) {
      rowDiv = document.createElement('div');
      participantDiv = document.createElement('div');
      participantDiv.className = 'participant glyphicon glyphicon-user';
      participantDiv.innerText = participant + ' ';
      span = document.createElement('span');
      span.id = participant;
      span.className = 'remove-participant glyphicon glyphicon-remove';
      span.onclick = removeUser;

      participantDiv.appendChild(span);
      rowDiv.appendChild(participantDiv);
      participantsList.appendChild(rowDiv);
    }
  }

  show('panel-participants');
  participantsVisible = true;
}

function hideParticipants() {
  hide('panel-participants');
  participantsVisible = false;
}

function toggleParticipants() {
  if (participantsVisible) {
    hideParticipants();
  } else {
    showParticipants();
  }
}

function switchCalls() {
  switchCall();
}

function moveCall() {
  move();
}

function transferCall() {
  transfer();
}

function hangup() {
  if ('call' === currentCallType) {
    hangupCall();
  } else if ('conference' === currentCallType) {
    endConference();
  }
}
