const httpMocks = require('node-mocks-http');
const knex = require('../../src/dataBase/knex');

const AppError = require("../../src/Utils/appError.js");
const TransactionsController = require('../../src/Controllers/transactionsController.js');

jest.mock("../../src/utils/appError");

let id;

async function insertingTestData() {
    await knex("users")
    .insert({
        name: 'Test',
        email: 'test@test',
        password: '123'
    })
    .then(async () => {
        const result = await knex.from("users").select("id").first();
        id = result.id;
    })
    .finally(async () => {
        await knex("transactions").insert({
        type: "income",
        date: "2023-07-29",
        product: "Test Product",
        value: 100,
        client: "Test Client",
        user_id: id
    });
    });
};

async function clearDatabase() {
    await knex("transactions").truncate();
    await knex("users").truncate();
}

beforeAll(async () => {
    await knex.migrate.latest();
    await clearDatabase();
    await insertingTestData();
});

describe('TransactionsController.create()', () => {

    it('Should upload transactions data', async () => {
        const request = httpMocks.createRequest({
            user: { id: id },
            body: {
                transactions: [
                    {   
                        type: "income2",
                        date: "2023-07-29",
                        product: "Test Product2",
                        value: 100,
                        client: "Test Client",
                        user_id: id
                    },
                ],
            },
        });
    
        const response = httpMocks.createResponse();
        const transactions = new TransactionsController();
    
        try {
            await transactions.create(request, response);
        } catch (error) {
            console.log(error);
        };

        expect(response._getStatusCode()).toBe(201);
        expect(response._headers['content-type']).toContain('application/json');
        expect(response.writableEnded).toBe(true);
        expect(response._getData()).toEqual("\"Upload realizado com sucesso!\"");
    });
});


describe('TransactionsController.index()', () => {
    it('Should throw an error if the user do not exists', async () => {

        const request = httpMocks.createRequest({
            user: { id: 10 }
        });

        const response = httpMocks.createResponse();

        const transactions = new TransactionsController();

        try {
            await transactions.index(request, response);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
        };
    });

    it('Should return an array with transactions', async () => {

        const request = httpMocks.createRequest({
            user: { id: id }
        });

        const response = httpMocks.createResponse();

        const transactions = new TransactionsController();

        const createSpy = jest.spyOn(transactions, 'index');

        try {
            await transactions.index(request, response);
        } catch (error) {
            console.log(error)
        }
        
        const responseBody = response._getData();
        const parsedResponse = JSON.parse(responseBody);
    
        expect(parsedResponse).toBeInstanceOf(Array);
        expect(parsedResponse).toHaveLength(2);
        
        expect(createSpy).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(201);
    });
});

