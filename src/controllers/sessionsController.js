const knex = require("../dataBase/knex");
const AppError = require("../Utils/appError");
const { compare } = require("bcryptjs");

require("dotenv/config");

const authConfig = require("../Configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsController {
    async create(request, response) {
        const { email, password } = request.body;

        if(!email || !password) {
            throw new AppError("Preencha todos os campos.");
        }

        const user = await knex("users").where({ email }).first();
  
        if(!user) {
            throw new AppError("Email e/ou senha incorretos.");
        }
        
        const passwordMatch = await compare(password, user.password);
        
        if(!passwordMatch) {
            throw new AppError("Email e/ou senha incorretos");
        }
        
        const { secret, expiresIn } = authConfig.jwt;
        
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        return response.json({user, token})
    }
}

module.exports = SessionsController;