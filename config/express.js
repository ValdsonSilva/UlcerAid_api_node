const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const consign = require("consign")
const cors = require("cors")
require('dotenv').config();


module.exports = () => {
    const app = express();

    app.set('port', process.env.PORT || config.get("server.port"))

    app.use(bodyParser.json());

    consign({cwd: 'api'})
        .then('models')
        .then('controllers')
        .then('routes')
        .into(app)
    
    return app;
}