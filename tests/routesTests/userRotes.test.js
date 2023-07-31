const { hash } = require("bcryptjs");
const knex = require("../../src/dataBase/knex");
const UsersController = require("../../src/controllers/usersController");
const httpMocks = require('node-mocks-http');  // library to mock express request and response

jest.mock("bcryptjs");
jest.mock("../../src/dataBase/knex");
jest.mock("../../src/utils/appError");

describe("UsersController", () => {
    it("Creating an user", async () => {
      try {
        hash.mockResolvedValue("hashedPassword");
        knex.mockReturnValue({
          select: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          then: jest.fn().mockReturnValue([]),
          insert: jest.fn().mockResolvedValue([1]),
        });
  
        const request = httpMocks.createRequest({
          body: {
            name: "Bell Amancio",
            email: "test@example.com",
            password: "password",
          },
        });
        const response = httpMocks.createResponse();
  
        const controller = new UsersController();
        await controller.create(request, response);
  
        expect(response._getStatusCode()).toBe(201);
        expect(response._getData()).toEqual("\"Usuário cadastrado com sucesso!\"");
        expect(hash).toHaveBeenCalledWith("password", 8);
        expect(knex).toHaveBeenCalledWith("users");
      } catch (error) {
        console.error(error);
      }
    });
  });