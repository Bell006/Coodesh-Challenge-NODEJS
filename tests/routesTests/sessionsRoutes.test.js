
const { compare, hash } = require("bcryptjs");
const httpMocks = require('node-mocks-http');

const db = require("../../src/dataBase/db-config");
const SessionsController = require("../../src/controllers/sessionsController");
const AppError = require("../../src/Utils/appError");

jest.mock("../../src/utils/appError");

describe('SessionsController.createUser()', () => {

    beforeAll(async () => {
        await db.migrate.latest();
    });
    
    const testEmail = 'test@test.com';
    let testPassword = '';

    const request = httpMocks.createRequest({
        method: 'POST',
        body: {
            email: testEmail,
            password: testPassword
        },
    });

    const response = httpMocks.createResponse();
    
    const controller = new SessionsController();

    it('Should throw an error if not provided with both parameters', async () => {
        try {
            await controller.create(request, response);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
        }
    });
    
    it('Should throw an error if the user do not exists', async () => {
        try {
            await controller.create(request, response);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
        };
    });

    it('Should create a session if provided correctly', async () => {
        password = 'testpassword';

        const testUser = {
            email: 'test@test.com',
            password: 'testpassword',
        };

        await db('users').insert(testUser);

        try {
            const result = await controller.create(request, response);

            expect(result).toBeInstanceOf(Object);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
        } catch (error) {
            console.error(error); 
        }
    });
});