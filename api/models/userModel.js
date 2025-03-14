const {PrismaClient} = require("@prisma/client");
const { ObjectId } = require("mongodb");
const prisma = new PrismaClient()


const userModel = {


    // CRUD de usuário com prisma
    createUser: async (data) => {
        return await prisma.user.create({
            data: {
                username: data.username,
                password: data.password,
                cpf: data.cpf,
                contact: data.contact,
                address: data.address,
                coren: data.coren,
                area: data.area,
                institution: data.institution
            }
        });
    },

    getAllUsers: async () => {
        return await prisma.user.findMany();
    },

    getUserById: async (id) => {

        return await prisma.user.findUnique({
            where: {id: new ObjectId(id).toString()}
        })
    },

    updateUser: async (id, data) => {
        return await prisma.user.update({
            where: {id: String(id)},
            data : {
                username: data.username,
                password: data.hashedPassword,
                cpf: data.cpf,
                contact: data.contact,
                address: data.address,
                coren: data.coren,
                area: data.area,
                institution: data.institution
            }
        })
    },

    deleteUser: async (id) => {
        return await prisma.user.delete({
            where: {id: String(id)}
        })
    },
}

module.exports = userModel;