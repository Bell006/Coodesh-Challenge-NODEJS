const knex = require("../dataBase/knex");
const AppError = require("../utils/appError");

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
            throw new AppError('Não foi possível fazer o upload.', 500);
        };

        return response.status(201).json("Upload realizado com sucesso!");
    };

    async index(request, response) {
        const user_id = request.user.id;

        const transactions = await knex("transactions").where({ user_id }).returning("*");

        try {
            const transactions = await knex("transactions").where({ user_id }).returning("*");
        } catch(error) {
            throw new AppError("Não foi possível buscar os dados da transação.")
        }

        return response.status(201).json(transactions);

    };
};
 
module.exports = TransactionsController;