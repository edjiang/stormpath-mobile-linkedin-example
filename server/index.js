var express = require('express')
var stormpath = require('express-stormpath')
var bodyParser = require('body-parser')

var app = express()

app.use(stormpath.init(app, {
  web: {
    produces: ['application/json']
  }
}))

// Endpoint for getting a user's notes. 
app.get('/callbacks/linkedin/mobile', function(req, res) {
	res.json({notes: req.user.customData.notes || "This is your notebook. Edit this to start saving your notes!"})
})

// Once Stormpath has initialized itself, start your web server!
app.on('stormpath.ready', function () {
  app.listen(process.env.PORT || 3000)
})
