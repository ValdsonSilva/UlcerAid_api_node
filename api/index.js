const app = require("../config/express.js")();
// const config = require("config");
const port = config.get("server.port");
// require('dotenv').config();

app.get("/", (req, resp) => resp.send("Express on Vercel"))


// rodar aplicação -- ⚠️ Não usar app.listen() aqui na Vercel
// app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))

module.exports = app;