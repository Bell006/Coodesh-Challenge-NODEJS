const httpMocks = require('node-mocks-http');
const knex = require("../../src/dataBase/knex");
const TransactionsController = require("../../src/controllers/transactionsController");
const AppError = require("../../src/Utils/appError");

jest.mock("../../src/dataBase/knex");
jest.mock("../../src/utils/appError");

// Test user_id
const testUserId = 123;

describe('TransactionsController', () => {
    it('Create - Success', async () => {
        const testUserId = 123; // Substitua isso pelo ID do usuário que deseja usar no teste

        const request = httpMocks.createRequest({
            user: { id: testUserId },
            body: {
                transactions: [
                    {
                        type: "income",
                        date: "2023-07-29",
                        product: "Test Product",
                        value: 100,
                        client: "Test Client"
                    },
                    // Adicione mais transações aqui, se necessário
                ]
            },
        });

        const response = httpMocks.createResponse();

        const mockInsert = jest.fn().mockResolvedValue([
            {
                id: 1,
                type: "income",
                date: "2023-07-29",
                product: "Test Product",
                value: 100,
                client: "Test Client",
                user_id: testUserId
            },
            // Adicione mais transações inseridas aqui, se necessário
        ]);

        knex.mockReturnValue({
            where: jest.fn().mockReturnThis(),
            returning: jest.fn().mockReturnThis(),
            insert: mockInsert,
        });

        const controller = new TransactionsController();
        await controller.create(request, response);

        // Verificações
        expect(response._getStatusCode()).toBe(201);
        expect(JSON.parse(response._getData())).toEqual("Upload realizado com sucesso!"); // A mensagem de resposta deve corresponder à retornada no controller

        expect(knex).toHaveBeenCalledWith("transactions");
        expect(knex().where).toHaveBeenCalledWith({ user_id: testUserId });
        expect(knex().returning).toHaveBeenCalledWith("*");

        const expectedTransactions = request.body.transactions.map(transaction => ({
            ...transaction,
            user_id: testUserId,
        }));

        expect(mockInsert).toHaveBeenCalledTimes(1); 
        expect(mockInsert).toHaveBeenCalledWith(expectedTransactions[0]); 
    });
});