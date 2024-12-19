const app = require('./config/express')();
const port = app.get('port')
require('dotenv').config();


// rodar aplicação
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})