const knex = require("../dataBase/knex");
const AppError = require("../utils/appError");
const { compare } = require("bcryptjs");

const authConfig = require("../Configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsController {
    async create(request, response) {
        try {
            const { email, password } = request.body;

            if (!email || !password) {
                throw new AppError("Todos os campos são obrigatórios!");
            };

            const user = await knex("users").where({ email }).first();

            if (!user) {
                throw new AppError("E-mail e/ou senha incorretos", 401);
            };

            const passwordMatch = await compare(password, user.password);

            if (!passwordMatch) {
                throw new AppError("E-mail e/ou senha incorretos", 401);
            };

            const { secret, expiresIn } = authConfig.jwt;
            const token = sign({}, secret, {
                subject: String(user.id),
                expiresIn
            });

            return response.json({ user, token });
        } catch (error) {
            console.error(error)
            throw new AppError ("Não foi possível fazer o cadastro.")
        }
    };
}

module.exports = SessionsController;
