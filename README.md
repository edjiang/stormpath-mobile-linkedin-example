# Stormpath Mobile LinkedIn Sign-In Example

This is an example to show how to sign into LinkedIn on mobile via deep linking.

Since LinkedIn's mobile SDKs don't support [using the access token on the server](https://developer.linkedin.com/docs/ios-sdk-auth) or logging in without the LinkedIn app, I whipped up this demo to show how to do LinkedIn login through Stormpath. 

As I wrote this really quickly, please open up a GitHub issue if you want me to clarify some of the instructions. 

## Setup

1. Make sure you have a Stormpath Application with a LinkedIn directory configured.
2. In the LinkedIn developer site, configure `http://localhost:3000/callbacks/linkedin/ios` as a callback URL
3. Clone this repository. 
4. Run `npm install` in the `server` directory to install server modules
5. Run the server using `node index.js`
6. Run the iOS app in XCode. LinkedIn login works!

## Building this in your own app

I used the base [express-stormpath](https://github.com/stormpath/express-stormpath) and [Swift example](https://github.com/stormpath/stormpath-ios-example) projects to build this. If you want to see the steps I took, look at the commit history -- I tried to make changes minimal and things pretty straightforward. 