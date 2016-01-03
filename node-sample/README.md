# Sample Web App for AT&T Enhanced WebRTC JavaScript SDK

This sample app is a Node.js® Web application for demonstrating the features of AT&T Enhanced WebRTC, and includes the following functionality:

* OAuth endpoint for Mobile Number authorization and callback
* App configuration, including editable fields for app key, app secret, and redirect_URI
* Login and logout functionality for Virtual Number and Account ID users

You can use the sample app as a reference to explore Enhanced WebRTC features, or as a basis for developing your own Web apps using the Enhanced WebRTC SDK.


## System requirements

* Node.js, available from [Nodejs.org](http://nodejs.org/download/)
* Windows or Mac OS X
* Chrome v41 or later
* Firefox v33 (tested)

## Contents of this Package

This package contains the software necessary to run the sample app:

- `/package.json` - Configuration options
- `/app.js` - Main Node.js program

## Using the Sample App Server

Sample app configuration options are located in the file `/package.json`:

Sample app configuration options are located in `/package.json`.

#Sample App Deployment

This section provides step-by-step instructions for deploying the AT&T Enhanced WebRTC SDK sample app using the Node.js server platform. The sample app uses our integrated Node.js DHS for OAuth services. Alternately, you can integrate AT&T Oauth services into your system using our [Restify DHS library](https://github.com/attdevsupport/ewebrtc-sdk/tree/master/restify-dhs).

##Installing Node.js
The installation process varies depending on your server's operating system. You can download the self-guided Node.js installation package for your system at [Nodejs.org](http://nodejs.org/download/).

##Downloading the SDK
The complete AT&T Enhanced WebRTC SDK package is located in our GitHub repository. You can either download the package from the repository or use the following steps to clone the repository and verify the contents.

1. Clone the GitHub repository:
   $ git clone https://github.com/attdevsupport/ewebrtc-sdk.git
2. Verify the package contents:
 * /node-sample – AT&T Enhanced WebRTC sample app
 * /node-sample/public/js/webrtc-sdk.mom.js – AT&T Enhanced WebRTC JavaScript library
 * /tutorial/index.html – AT&T Enhanced WebRTC API Tutorial
 * /api-docs/index.html – SDK API reference documentation

##Installing the Sample App
Follow these steps to install and start the sample app:

1. Open /node-sample/package.json with a text editor.
2. Search for the "sandbox" section and locate the following lines:
```
"sandbox": {
	"app_key": "YourAppKey", 
	"app_secret": "YourAppSecret", 
	"oauth_callback": "https://127.0.0.1:9001/oauth/callback", 
	"app_token_url": "https://127.0.0.1:9001/tokens",
	"app_e911id_url": "https://127.0.0.1:9001/e911ids",
	"virtual_numbers_pool": [ 
		"30056001xx", 
		"30056001yy", 
		"30056001zz" ], 
"ewebrtc_domain": "your.ewebrtc_domain.com" 
},
```
3. Replace YourAppKey and YourAppSecret with your assigned App Key and App Secret.
4. If you’re using a URL other than 127.0.0.1:9001, replace “https://127.0.0.1:9001” in the “sandbox” section above, as well as in /js/router.js, with that URL.
5. If you’re using virtual numbers, replace the list of numbers in the virtual_numbers_pool line with the numbers allocated to you during the app setup process. Please remove any special characters such as “-” or “()” from the phone numbers. A leading “1” is optional.
6. Replace your.ewebrtc_domain.com with the same domain you entered when you registered your app in My Apps.
7. Save and close the file.
8. Install the required Node.js dependencies:
   ```
   $ cd node-sample
   $ npm install
   ```
   
9. Start the server:
   ```
   $ npm start
   ```
   
##Launching the Sample App
In a supported Web browser, enter https://127.0.0.1:9001 to launch the AT&T Enhanced WebRTC sample app. Replace "127.0.0.1" with your own URL if you are hosting at a different location. Note: If you are using a VPN, disable it and use a direct Internet connection to run the sample app. 

# RESTful API Information

## Login
```
POST /login
```
### Parameters

```Javascript
{ 
  "user_id": "user_id",
}
```

### Response

``` javascript
{
  "user_id": "user_id",
  "user_name": "user_name",
  "user_type": "user_type",
  "role_type": "role_type"
}
```

## Logout
```
DELETE /logout
```

### Parameters
None

### Response

``` javascript
{
  message: 'User logged out successfully'
}
```

## Authorize

Endpoint for authorizing Mobile Number users using AT&T OAuth.


```
GET /oauth/authorize
```

### Parameters
None

### Response
`HTTP 302`


## Authorize Callback

Endpoint for the OAuth Authorize callback.

```
GET /oauth/callback
```

### Parameters

* `code=auth_code`

### Response

`HTTP 302`

