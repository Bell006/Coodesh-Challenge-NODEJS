
const AppError = require("../Utils/appError");
const knex = require('../dataBase/knex');

class TransactionsController  {

    async create(request, response) {
        const user_id = request.user.id;
        const transactions = request.body.transactions;

        try {
            for (const transaction of transactions) {
                await knex("transactions").where({ user_id }).returning("*").insert({
                    type: transaction.type,
                    date: transaction.date,
                    product: transaction.product,
                    value: transaction.value,
                    client: transaction.client,
                    user_id,
                });
            };
        } catch (error) {
            console.error(error)
            throw new AppError('Não foi possível fazer o upload.', 500);
        };

        response.status(201).json("Upload realizado com sucesso!");
    };

    async index(request, response) {
        const user_id = request.user.id;

        const userExists = await knex("users").where({ id: user_id }).first();

        if (!userExists) {
            throw new AppError("Usuário não encontrado.", 404);
        }    

        try {
            const transactions = await knex("transactions").where({ user_id }).returning("*");

            return response.status(201).json(transactions);
        } catch(error) {
            throw new AppError("Não foi possível buscar os dados da transação.");
        };
    };
};
 
module.exports = TransactionsController;