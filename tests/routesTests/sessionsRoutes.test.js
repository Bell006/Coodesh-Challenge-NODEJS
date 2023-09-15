const httpMocks = require('node-mocks-http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const knex = require("../../src/dataBase/knex");
const SessionsController = require("../../src/Controllers/sessionsController.js");
const AppError = require("../../src/Utils/appError");

jest.mock("../../src/Utils/appError");

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

async function insertingTestData() {
    await knex("users")
    .insert({
        name: 'Test',
        email: 'test@test',
        password: '123'
    })
};

async function clearDatabase() {
    await knex("users").truncate();
}

beforeAll(async () => {
    await knex.migrate.latest();
    await clearDatabase();
    await insertingTestData();
});

describe('SessionsController.create()', () => {

    it('Should throw an error if not provided with both parameters', async () => {
        const testEmail = 'test@test';

        const request = httpMocks.createRequest({
            body: {
                email: testEmail,
                password: ''
            },
        });

        const response = httpMocks.createResponse();
        const sessions = new SessionsController();

        const createSpy = jest.spyOn(sessions, 'create');

        try {
            await sessions.create(request, response);

            throw new Error("The function do not threw an exception");
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
        }

        expect(createSpy).toHaveBeenCalled();
    });
    
    it('Should throw an error if the user do not exists', async () => {
        const testEmail = 'test2@test2';
        const testPassword = '123';

        const request = httpMocks.createRequest({
            body: {
                email: testEmail,
                password: testPassword
            },
        });

        const response = httpMocks.createResponse();
        
        const sessions = new SessionsController();

        try {
            await sessions.create(request, response);

            throw new Error("The function do not threw an exception");
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
        }
    });

    it('Should create a session if provided correctly', async () => {

        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('testToken87438579');

        const request = httpMocks.createRequest({
            body: {
                email: 'test@test',
                password: '123'
            }
        });

        const response = httpMocks.createResponse();
        
        const sessions = new SessionsController();

        try {
            await sessions.create(request, response);
        } catch (error) {
            console.log(error);
            expect(error).toBeInstanceOf(AppError);
        };

        const responseBody = response._getData();
        const parsedResponse = JSON.parse(responseBody);
    
        expect(parsedResponse).toBeInstanceOf(Object);
        expect(parsedResponse).toHaveProperty('user');
        expect(parsedResponse).toHaveProperty('token')
    });
}); 