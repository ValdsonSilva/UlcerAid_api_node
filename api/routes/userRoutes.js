module.exports = (app) => {
    // console.log('Controladores carregados:', app.controllers);

    const userController = app.controllers.userController;

    // login
    app.post('/api/v1/login', userController.loginUser);

    // logo mais assinar as outras rotas aqui
    app.post('/api/v1/create-user', userController.createUser);
    app.get('/api/v1/users', userController.getAllUsers);
    app.get('/api/v1/user', userController.authenticateToken, userController.getUserById);
    app.put('/api/v1/update-user', userController.authenticateToken, userController.updateUser);
    app.delete('/api/v1/delete-user', userController.deleteUser);
}

/*
    Na função de update, a senha não está sendo hasheada antes de gravar no banco,
    por isso da senha inválido no Valdson no login
 */