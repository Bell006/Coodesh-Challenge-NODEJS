const { compare, hash } = require("bcryptjs");
const httpMocks = require('node-mocks-http');

const knex = require("../../src/dataBase/knex");
const SessionsController = require("../../src/controllers/sessionsController");
const authConfig = require("../../src/Configs/auth");
const { sign } = require("jsonwebtoken");

jest.mock("jsonwebtoken");
jest.mock("bcryptjs");
jest.mock("../../src/dataBase/knex");
jest.mock("../../src/utils/appError");

describe('SessionsController', () => {
    it('SignIn', async () => {

        try {
            hash.mockResolvedValue("hashedPassword");

            const secret = authConfig.jwt.secret;
            const expiresIn = authConfig.jwt.expiresIn;
    
    
            sign.mockImplementation((payload, secret, options) => {
                return "testToken";
            });
    
            const testUser = {
                id: 123,
                email: "test@example.com",
                password: "hashedPassword"
            };
    
            knex.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(testUser), // Returning test user
            });
    
            const request = httpMocks.createRequest({
                body: {
                    email: "test@example.com",
                    password: "password"
                },
            });
    
            const response = httpMocks.createResponse();
    
            const controller = new SessionsController();
            await controller.create(request, response);
    
            // Verifing
            expect(response._getStatusCode()).toBe(200);
            expect(response._getData()).toEqual({
                user: testUser,
                token: "testToken",
            });
    
            expect(compare).toHaveBeenCalledWith("password", "hashedPassword");
    
            expect(knex).toHaveBeenCalledWith("users");
            expect(knex().where).toHaveBeenCalledWith({ email: "test@example.com" });
            expect(knex().first).toHaveBeenCalled();
    
            expect(sign).toHaveBeenCalledWith({}, secret, {
                subject: '123',
                expiresIn
            });
          } catch (error) {
            console.error(error);
          }
       
    });
});