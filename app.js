const app = require('./config/express')();
const port = app.get('port')
require('dotenv').config();

app.get("/", (req, resp) => resp.send("Express on Vercel"))


// rodar aplicação
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))