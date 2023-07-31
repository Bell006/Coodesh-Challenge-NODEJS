const { hash } = require("bcryptjs");
const knex = require("../dataBase/knex");
const AppError = require("../utils/appError");

class UsersController {
    constructor() {
        this.create = this.create.bind(this);
    }

    validateFields(requestBody) {
        const { name, email, password } = requestBody;

        if (!name || !email || !password) {
            throw new AppError("Todos os campos são obrigatórios!");
        }
    }

    async isEmailUsed(email) {
        const result = await knex("users").select("email").where('email', email);

        if (result.length !== 0) {
            throw new AppError("Este email já está em uso.");
        }
    }

    async create(request, response) {
        try {
            const { name, email, password } = request.body;

            this.validateFields(request.body);

            await this.isEmailUsed(email);

            const hashedPassword = await hash(password, 8);

            const users = await knex("users").insert({
                name,
                email,
                password: hashedPassword,
            });

            return response.status(201).json("Usuário cadastrado com sucesso!");
        } catch (error) {
            throw new AppError("Não foi possível realizar o cadastro.")
        }
    }
}

module.exports = UsersController;