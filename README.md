# Stormpath Mobile LinkedIn Sign-In Example

This is an example to show how to sign into LinkedIn on mobile via deep linking.

Since LinkedIn's mobile SDKs don't support [using the access token on the server](https://developer.linkedin.com/docs/ios-sdk-auth) or logging in without the LinkedIn app, I whipped up this demo to show how to do LinkedIn login through Stormpath. 

As I wrote this really quickly, please open up a GitHub issue if you want me to clarify some of the instructions. 

## Setup

1. Make sure you have a Stormpath Application with a LinkedIn directory configured.
2. In the LinkedIn developer site, configure `http://localhost:3000/callbacks/linkedin/ios` as a callback URL. Also, make sure `r_emailaddress` is checked.
3. Clone this repository. 
4. Run `npm install` in the `server` directory to install server modules
5. Run the server using `node index.js`
6. Run the iOS app in XCode. LinkedIn login works!

## How this works

LinkedIn is a weird beast, as its mobile SDKs don't allow you to use the access token on the server. So, we have to implement their standard OAuth flow and have the express server help us sign into the app. Here's what happens when we click on "login with LinkedIn":

1. The app directs you to http://localhost:3000/login/linkedin/ios. This endpoint will set a cookie for CSRF protection, and redirect the user to the LinkedIn sign-in page. 
2. The user logs into LinkedIn and authorizes the app. LinkedIn redirects the user back to http://localhost:3000/callbacks/linkedin/ios with an authorization code.
3. The server makes a POST request to LinkedIn with the authorization code and its client secret to generate an access token. 
4. The server redirects the user to testapp12345://authorize/linkedin?access_token=ACCESSTOKENHERE, which is a url scheme registered by the iOS app. The iOS app takes the access token, and uses it in the standard Stormpath flow to log in. 

## Building this in your own app

I used the base [express-stormpath](https://github.com/stormpath/express-stormpath) and [Swift example](https://github.com/stormpath/stormpath-ios-example) projects to build this. If you want to see the steps I took, look at the commit history -- I tried to make changes minimal and things pretty straightforward. 

**Note**: I did modify two files in the iOS SDK in [this commit](https://github.com/edjiang/stormpath-mobile-linkedin-example/commit/6fb8162720c26a9fdaf53c45efee6435da716fdf). While you will have to keep these changes in your own app, I am planning to add this to the next version of the iOS SDK, so you are safe to make these changes. 