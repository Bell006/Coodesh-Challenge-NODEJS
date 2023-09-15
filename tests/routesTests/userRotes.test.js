const knex = require("../../src/dataBase/knex");
const httpMocks = require('node-mocks-http');

const UsersController = require("../../src/controllers/usersController.js");
const AppError = require("../../src/Utils/appError.js");

jest.mock("../../src/utils/appError");

async function clearDatabase() {
    await knex("users").truncate();
}

beforeAll(async () => {
    await knex.migrate.latest();
    await clearDatabase();
});

describe("UsersController.create()", () => {

    it("Should create an user", async () => {
      const request = httpMocks.createRequest({
            body: {
               name: 'testName',
               email: 'test@test.com',
               password: '123'
            }
        });
    
        const response = httpMocks.createResponse();
  
        const controller = new UsersController();

        try {
            await controller.create(request, response);
        } catch(error) {
            console.log(error);
        };
  
        expect(response._getStatusCode()).toBe(201);
        expect(response._getData()).toEqual("\"Usuário cadastrado com sucesso!\"");
    });

    it("Should throw an error if provided with an existing email", async () => {

        await knex("users").insert({
        name: 'Test',
        email: 'test@test.com',
        password: '123'
        })

        const request = httpMocks.createRequest({
              body: {
                 name: 'testName',
                 email: 'test@test.com',
                 password: '123'
              }
          });
      
        const response = httpMocks.createResponse();

        const controller = new UsersController();

        try {
            await controller.create(request, response);

            throw new Error("The function do not threw an exception");
        } catch(error) {
            expect(error).toBeInstanceOf(AppError);
        };
      });

    it("Should throw an error if provided with a missing parameter", async () => {

        const request = httpMocks.createRequest({
                body: {
                    name: 'testName',
                    email: '',
                    password: '123'
                }
            });
        
        const response = httpMocks.createResponse();

        const controller = new UsersController();

        try {
            await controller.create(request, response);

            throw new Error("The function do not threw an exception");
        } catch(error) {
            expect(error).toBeInstanceOf(AppError);
        };
    });
}); 



