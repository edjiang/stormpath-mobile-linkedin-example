var express = require('express')
var stormpath = require('express-stormpath')
var cookieparser = require('cookie-parser')
var request = require('request')

var app = express()

app.use(stormpath.init(app, {
  web: {
    produces: ['application/json']
  }
}))

// LinkedIn Client ID
var linkedinClientId
var linkedinClientSecret

// Mobile App URL Scheme

var iosEndpoint = 'testapp12345://authorize/linkedin'

// LinkedIn iOS kickoff
app.get('/login/linkedin/ios', function(req, res) {
	var redirectUrl = req.protocol + '://' + req.get('host') + '/callbacks/linkedin/ios'
	var state = Math.floor(Math.random()*1000000)
	var authorizationUrl = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=' 
		+ linkedinClientId + '&redirect_uri=' + redirectUrl + '&state=' + state

	res.cookie('oauthState', state)
	res.redirect(authorizationUrl)
})

// LinkedIn iOS callback
app.get('/callbacks/linkedin/ios', function(req, res) {
	if (req.query.error != null || req.query.code == null || req.query.state != req.cookies.oauthState) {
		// Redirect to mobile app with error
		res.redirect(iosEndpoint + '?error_description=' + 'Oops! Something went wrong with this request.')
		return
	}
	// Clear state
	res.clearCookie('oauthState')

	// Exchange for auth code
	var oauthTokenRequest = {
		url: 'https://www.linkedin.com/uas/oauth2/accessToken',
		form: { 
			grant_type: 'authorization_code',
			code: req.query.code,
			redirect_uri: req.protocol + '://' + req.get('host') + req.path,
			client_id: linkedinClientId,
			client_secret: linkedinClientSecret
		} 
	}

	request.post(oauthTokenRequest, function(err, httpResponse, body) {
		var parsedBody = JSON.parse(body)

		if (parsedBody.access_token) {
			res.redirect(iosEndpoint + '?access_token=' + parsedBody.access_token)
		} else {
			res.redirect(iosEndpoint + '?error_description=' + parsedBody.error_description)
		}
	})
})

// Once Stormpath has initialized itself, start your web server!
app.on('stormpath.ready', function () {
	loadLinkedInApiKeys(function() {
  	app.listen(process.env.PORT || 3000)
	})
})

function loadLinkedInApiKeys(next) {
	app.get('stormpathApplication').getAccountStoreMappings(function(err, accountStoreMappings) {
		accountStoreMappings.map(function(accountStoreMapping) {
			accountStoreMapping.getAccountStore({expand: 'provider'}, function(err, accountStore) {
				if (accountStore.provider.providerId == 'linkedin') {
					linkedinClientId = accountStore.provider.clientId
					linkedinClientSecret = accountStore.provider.clientSecret
					next()
				}
			})
		})
	})
}