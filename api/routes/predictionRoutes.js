const multer = require("../../config/uploadConfig")
const userController = require("../controllers/userController")

module.exports = (app) => {
    const predictionController = app.controllers.predictionController;

    app.post('/api/v1/predict', userController.authenticateToken, multer.single('image'), predictionController.predict)
}