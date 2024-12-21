const predictionModel = require("../models/predictModel")

exports.predict = async (req, resp) => {
    const image = req.file; // arquivo recebido do upload

    if (!image) {
        return resp.status(400).json({error: "Imagem não fornecida"})
    }

    try {
        const result = await predictionModel.predict(image.path) // chama o modelo para predizer
        return resp.status(200).json({message: "Predição realizada com sucesso", result})
        
    } catch (error) {
        return resp.status(500).json({error: "Erro ao realizar predição", details: error})
    }
}