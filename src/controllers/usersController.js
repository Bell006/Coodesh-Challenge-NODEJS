const { hash } = require("bcryptjs");
const knex = require("../dataBase/knex");
const AppError = require("../Utils/appError");

class UsersController {

    async create(request, response) {
        const { name, email, password } = request.body;

        if(!name || !email || !password) {
            throw new AppError("Preencha todos os campos para prosseguir.");
        };

        const checkIfUserExists = await knex("users").where({email}).first();

        if(checkIfUserExists) {
            throw new AppError("O email inserido já está em uso.", 400)
        }

        const hashedPassword = await hash(password, 8);

        await knex("users").insert({
            name,
            email,
            password: hashedPassword,
        })

        return response.status(201).json("Usuário cadastrado com sucesso!");
    };
};

module.exports = UsersController;