const {exec} = require("child_process");
const { error } = require("console");
const path = require("path");
const { stdout, stderr } = require("process");

const predictionModel = {
    predict: (imagePath) => {
        return new Promise((resolve, reject) => {
            const scriptPath = path.resolve(__dirname, "..", "..", "predict.py"); // Caminho para o script Python
            const command = `python ${scriptPath} ${imagePath}`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(`Erro ao executar o script: ${stderr || error.message}`);
                }
                console.log("Saída completa do script Python:", stdout); // Log para depuração
                try {
                    const result = JSON.parse(stdout.trim()); // A saída do Python deve ser JSON
                    resolve(result);
                } catch (error) {
                    reject(`Erro ao parsear o resultado: ${error.message}`);
                }
            })
        })
    }
}

module.exports = predictionModel;