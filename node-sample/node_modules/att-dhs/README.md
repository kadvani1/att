`att-dhs` is an AT&T Developer Hosted Server library. For full details, see http://attdevsupport.github.io/ewebrtc-sdk/dhs-docs/

## Prerequisites

In order to be able to use `att-dhs` you need to have a node server

## Usage

This Developer Hosted Server (DHS) Library is a node library that enables you to manage the following:

* AT&T OAuth token creation using credentials and scope
* E911 ID creation

  ### Step 1: Configure the library

  This can be done be invoking `configure()` method from your server.
  ###### Example

  ```
  var myDHS = require("att-dhs");

  var options = {
    app_key: 'thirtytwocharacterapplicationkey',
    app_secret: '32_characters_application_secret'
  };

  myDHS.configure(options);
  ```

  ### Step 2: Get DHS configuration
  ###### Example

  ```
  var config = myDHS.getConfiguration();
  ```

  ### Step 3: Get Authorization URL
  ###### Example

  ```
  authorizationURL = myDHS.getAuthorizeUrl();
  ```

  ### Step 4: Create Access Token
  ###### Example

  ```
  var options = {
    app_scope: 'E911',
    success: function (result) {
       // do something
    },
    error: function (err) {
       // do something
    }
  };

  myDHS.createAccessToken(options);
  ```

  ### Step 5: Create E911 ID
  ###### Example
  ```
  var options = {
    token: 'token',
    address: {
      first_name: 'John',
      last_name: 'Doe',
      house_number: '1111',
      street: 'ABC Street',
      city: 'My City',
      state: 'My State',
      zip: '12345'
    },
    is_confirmed: 'false',
    success: function (result) {
       // do something
    },
    error: function (err) {
       // do something
    }
  };

  myDHS.createE911Id(options);
  ```

## Installation

```
npm install att-dhs
```
## License

[AT&T License](https://raw.githubusercontent.com/attdevsupport/ewebrtc-sdk/master/LICENSE.txt)
