const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

module.exports = {

    // Autenticação de usuários com JWT

    // CRUD de usuário com prisma
    createUser: async (req, resp) => {
        const { username, password } = req.body;

        if (username === null || password === null) {
            return resp.status(400).json({message: "Os campos não podem ser nulos"})
        }

        try {
            // hash da senha antes de salvar no banco
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {username, password: hashedPassword}
            });

            return resp.status(200).json({messagem: "Usuário cadastrado com sucesso", user})

        } catch (error) {
            return resp.status(500).json({message: "Erro ao criar usuário", details: error.message})
        }
    },

    getAllUsers: async (req, resp) => {
        try {
            const users = await prisma.user.findMany();
            return resp.status(200).json(users)

        } catch (error) {
            return resp.status(500).json({message: "Erro ao buscar todos os usuários"})
        }
    },

    getUserById: async (req, resp) => {
        const { id } = req.body;

        try {

            const user = await prisma.user.findUnique({
                where: {id: String(id)}
            })

            if (!user) {
                return resp.status(404).json({message: "Usuário não encontrado"})
            } 

            return resp.status(200).json({message: "Usuário encontrado", user})

        } catch (error) {
            return resp.status(500).json({message: "Erro ao buscar usuário", details: error.message})
        }
    },

    updateUser: async (req, resp) => {
        const id = req.body.id 
        const username = req.body.username || null
        const password = req.body.password || null

        if (id === null & username === null & password === null) {
            return resp.status(400).json({message: "É obrigatório conter no mínimo um campo não nulo"})
        }

        try {

            const user = await prisma.user.update({
                where: {id: String(id)},
                data: {username, password}
            })

            if (!user) {
                return resp.status(404).json({message: "Usuário não encontrado"})
            }

            return resp.status(200).json({message: "Dados do usuário alterados com sucesso", user})

        } catch (error) {
            return resp.status(500).json({message: "Erro ao atualizar dados do usuário", details: error.message})
        }
    },

    deleteUser: async (req, resp) => {
        const { id } = req.body;

        try {
            const user = await prisma.user.delete({
                where: {id: String(id)}
            })
            return resp.status(200).json({message: "Usuário deletado com sucesso"})

        } catch (error) {
            return resp.status(500).json({message: "Erro ao deletar usuário"})
        }
    },

    // validação de usuário com token JWt
    loginUser: async (req, resp) => {
        const {username, password} = req.body;

        // const unhashPassword = await bcrypt.decodeBase64(password)

        try {
            const user = await prisma.user.findFirst({
                where : {username}
            })

            if (!user) {
                return resp.status(404).json({message: "Usuário não encontrado"})
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid) {
                return resp.status(401).json({message: "Senha inválida"})
            }

            // gerar o Token
            const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET, {
                expiresIn: "1h", // token expira em 1 hora
            })

            return resp.status(200).json({message: "Login bem-sucedido", token})

        } catch (error) {
            return resp.status(500).json({message: "Erro ao fazer login", details: error.message})
        }
    },

    // middleware de autenticação (proteção de endpoints)
    authenticateToken: async (req, resp, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return resp.status(401).json({error: "Token não fornecido"})
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded // decodificar o token e anexar ao request
            next()
            
        } catch (error) {
            return resp.status(403).json({ error: "Token inválido" });
        }
    }
}