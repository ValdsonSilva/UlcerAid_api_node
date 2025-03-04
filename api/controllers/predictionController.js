const predictionModel = require("../models/predictModel")
const fs = require("fs")
const path = require("path")

exports.predict = async (req, resp) => {
    const image = req.file; // arquivo recebido do upload

    if (!image) {
        return resp.status(400).json({error: "Imagem não fornecida"})
    }

    try {
        const result = await predictionModel.predict(image.path) // chama o modelo para predizer
        // exclui a imagem de upload após a predição
        await deleteImage(image.path)
        return resp.status(200).json({message: "Predição realizada com sucesso", result})

        
    } catch (error) {
        return resp.status(500).json({error: "Erro ao realizar predição", details: error})
    }
}

const deleteImage = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return reject({error: "Arquivo não encontrado"});
            }

            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    return reject({ error: "Erro ao excluir o arquivo", details: unlinkErr });
                }
                return resolve({ message: "Arquivo excluído com sucesso" });
            })
        })
    })
}