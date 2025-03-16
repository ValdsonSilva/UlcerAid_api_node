const app = require("../config/express.js")();
const config = require("config");
const port = config.get("server.port");
// require('dotenv').config();

app.get("/", (req, resp) => resp.send("Express on Vercel"))


module.exports = app;