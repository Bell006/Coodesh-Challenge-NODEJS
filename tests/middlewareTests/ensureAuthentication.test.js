const httpMocks = require('node-mocks-http');
const { verify } = require('jsonwebtoken');

const ensureAuthentication = require("../../src/Middlewares/ensureAuthentication");
const AppError = require("../../src/Utils/appError");

jest.mock("../../src/Utils/appError");

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

const next = jest.fn();

verify.mockImplementation(() => ({ sub: '1' }));

describe('ensureAuthentication', () => {
    it('Should throw an error if not provided with a valid or empty token', () => {

        const request = httpMocks.createRequest({
            headers: {
                authorization: ''
            }
        });

        const response = httpMocks.createResponse();

        try {
            ensureAuthentication(request, response, next);

            new Error('The function do not threw an exception');
        } catch(error) {
            expect(error).toBeInstanceOf(AppError)
        }
    });

    it('Should set a user ID when provided with a valid token', () => {
        const request = httpMocks.createRequest({
            headers: {
                authorization: 'validTestToken6578324'
            }
        });

        const response = httpMocks.createResponse();

        ensureAuthentication(request, response, next);

        expect(request.user).toEqual({ id: '1' });
    });
}); 