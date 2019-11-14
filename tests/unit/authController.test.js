const httpMocks = require('node-mocks-http');
const AuthController = require('../../controllers/authController');
const models = require('../../database/models');
const newUser = require('../mock-data/new-user.json');

jest.mock('../../database/models');

let req;
let res;
let next;
const AuthId = '1';
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('AuthController.signup', () => {
  beforeEach(() => {
    req.body = newUser;
    req.user = newUser;
  });

  it('should have a createAuth function', () => {
    expect(typeof AuthController.signup).toBe('function');
  });

  it('should call models.User.create', () => {
    AuthController.signup(req, res, next);
    expect(models.User.create).toBeCalledWith(newUser);
  });
  it('should return 200 response code', async () => {
    await AuthController.signup(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeFalsy();
  });
  it('should return json body in response', async () => {
    models.User.create.mockReturnValue(newUser);
    await AuthController.signup(req, res, next);
    expect(typeof res.type).toBe('function');
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'property missing' };
    const rejectedPromise = Promise.reject(errorMessage);
    models.User.create.mockReturnValue(rejectedPromise);
    await AuthController.signup(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('AuthController.login ', () => {
  it('should have a login ', () => {
    expect(typeof AuthController.login).toBe('function');
  });
});

describe('AuthController.updatePassword ', () => {
  it('should have a updatePassword ', () => {
    expect(typeof AuthController.updatePassword).toBe('function');
  });
});

describe('AuthController.resetPassword ', () => {
  it('should have a resetPassword ', () => {
    expect(typeof AuthController.resetPassword).toBe('function');
  });
});

describe('AuthController.forgotPassword ', () => {
  it('should have a forgotPassword ', () => {
    expect(typeof AuthController.forgotPassword).toBe('function');
  });
});

describe('AuthController.restrictTo', () => {
  it('should have a restrictTo', () => {
    expect(typeof AuthController.restrictTo).toBe('function');
  });
});

describe('AuthController.protect', () => {
  it('should have a protect', () => {
    expect(typeof AuthController.protect).toBe('function');
  });
});
