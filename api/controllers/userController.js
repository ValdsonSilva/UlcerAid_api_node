const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const {ObjectId} = require("mongodb")

module.exports = {
    // Autenticação de usuários com JWT

    // CRUD de usuário com prisma
    createUser: async (req, resp) => {

        const data = {
            username : req.body.username || null,
            password : req.body.password || null,
            cpf : req.body.cpf || null,
            contact : req.body.contact || null,
            address : req.body.address || null,
            coren : req.body.coren || null,
            area : req.body.area || null,
            institution : req.body.institution || null,
        }


        if (data.username === null || data.password === null) {
            return resp.status(400).json({message: "Os campos não podem ser nulos"})
        }

        try {
            // hash da senha antes de salvar no banco
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const user = await userModel.createUser({
                username: data.username, 
                password: hashedPassword,
                cpf: data.cpf,
                contact: data.contact,
                address: data.address,
                coren: data.coren,
                area: data.area,
                institution: data.institution
            });

            return resp.status(200).json({messagem: "Usuário cadastrado com sucesso", user})

        } catch (error) {
            return resp.status(500).json({message: "Erro ao criar usuário", details: error.message})
        }
    },

    getAllUsers: async (req, resp) => {
        try {
            const users = await userModel.getAllUsers();
            return resp.status(200).json(users)

        } catch (error) {
            return resp.status(500).json({message: "Erro ao buscar todos os usuários"})
        }
    },

    getUserById: async (req, resp) => {
        const { id } = req.query;

        try {

            if (typeof id === 'object') {
                id = id.toString()
            }

            if (!ObjectId.isValid(id)) {
                throw new Error("ID inválido: " + id);
            }

            const user = await userModel.getUserById({id})

            if (!user) {
                return resp.status(404).json({message: "Usuário não encontrado"})
            } 

            return resp.status(200).json({message: "Usuário encontrado", user})

        } catch (error) {
            return resp.status(500).json({message: "Erro ao buscar usuário", details: error.message})
        }
    },

    updateUser: async (req, resp) => {
        const {id, password, ...bodyData} = req.body;

        if (!id) {
            return resp.status(400).json({message: "É obrigatório conter o ID"})
        }

        const fieldsToUpdate = Object.entries(bodyData)
            .filter(([key, value]) => value !== undefined && value !== null)
            .reduce((acc, [key, value]) => ({...acc, [key]: value}), {});

        if (Object.keys(fieldsToUpdate).length === 0 && !password) {
            return resp.status(400).json({message: "É obrigatório passar parâmetros para atualização"})
        }

        try {
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10)
                fieldsToUpdate.password = hashedPassword
            }

            const user = await userModel.updateUser(id, fieldsToUpdate)

            if (!user) {
                return resp.json(400).json({message: "Usuário não encontrado"})
            }

            return resp.status(200).json({message: "Dados do usuário alterados com sucesso", user})
        } catch (error) {
            return resp.status(500).json({
                message : "Erro ao atualizar dados do usuário(interno)",
                details : error.message
            })
        }
    },

    deleteUser: async (req, resp) => {
        const { id } = req.body;

        try {
            const user = await userModel.deleteUser(id)
            return resp.status(200).json({message: "Usuário deletado com sucesso"})

        } catch (error) {
            return resp.status(500).json({message: "Erro ao deletar usuário"})
        }
    },

    // validação de usuário com token JWT
    loginUser: async (req, resp) => {
        console.log(req.body)

        const {username, password} = req.body;

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