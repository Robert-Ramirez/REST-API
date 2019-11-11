const httpMocks = require('node-mocks-http');
const UserController = require('../../controllers/userController');
const models = require('../../database/models');
const newUser = require('../mock-data/new-user.json');
const allUsers = require('../mock-data/all-user.json');

jest.mock('../../database/models');

let req;
let res;
let next;
const UserId = '1';
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('UserController.deleteUser', () => {
  it('should have a deleteUser function', () => {
    expect(typeof UserController.deleteUser).toBe('function');
  });
  it('should delete with models.User.update', async () => {
    req.params.userId = UserId;
    req.body = newUser;
    await UserController.deleteUser(req, res, next);

    expect(models.User.update).toHaveBeenCalledWith(
      {
        active: false
      },
      { where: { id: [req.params.userId] } }
    );
  });
  it('should return a response with json data and http code 200', async () => {
    req.params.userId = UserId;
    req.body = newUser;
    models.User.update.mockReturnValue(newUser);
    await UserController.deleteUser(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newUser);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    models.User.update.mockReturnValue(rejectedPromise);
    await UserController.deleteUser(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('UserController.updateUser', () => {
  it('should have a updateUser function', () => {
    expect(typeof UserController.updateUser).toBe('function');
  });
  it('should update with models.User.update', async () => {
    req.params.userId = UserId;
    req.body = newUser;
    await UserController.updateUser(req, res, next);

    expect(models.User.update).toHaveBeenCalledWith(
      {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        active: newUser.active
      },
      { where: { id: [req.params.userId] } }
    );
  });
  it('should return a response with json data and http code 200', async () => {
    req.params.userId = UserId;
    req.body = newUser;
    models.User.update.mockReturnValue(newUser);
    await UserController.updateUser(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newUser);
  });

  it('should handle errors', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    models.User.update.mockReturnValue(rejectedPromise);
    await UserController.updateUser(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('UserController.getUser', () => {
  it('should have a getUser', () => {
    expect(typeof UserController.getUser).toBe('function');
  });
  it('should call models.User.findOne with route parameters', async () => {
    req.params.userId = '5d5ecb5a6e598605f06cb945';
    await UserController.getUser(req, res, next);
    expect(models.User.findOne).toBeCalledWith({
      where: { id: req.params.userId, active: true }
    });
  });
  it('should return json body and response code 200', async () => {
    models.User.findOne.mockReturnValue(newUser);
    await UserController.getUser(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newUser);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should do error handling', async () => {
    const errorMessage = { message: 'error finding UserModel' };
    const rejectedPromise = Promise.reject(errorMessage);
    models.User.findOne.mockReturnValue(rejectedPromise);
    await UserController.getUser(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('UserController.getAllUsers', () => {
  it('should have a getAllUsers function', () => {
    expect(typeof UserController.getAllUsers).toBe('function');
  });
  it('should call models.User.findAll({})', async () => {
    await UserController.getAllUsers(req, res, next);
    expect(models.User.findAll).toHaveBeenCalledWith({
      where: { active: true }
    });
  });
  it('should return response with status 200 and all Users', async () => {
    models.User.findAll.mockReturnValue(allUsers);
    await UserController.getAllUsers(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allUsers);
  });

  it('should handle errors in getAllUsers', async () => {
    const errorMessage = { message: 'UserModel is not defined' };
    const rejectedPromise = Promise.reject(errorMessage);
    models.User.findAll.mockReturnValue(rejectedPromise);
    await UserController.getAllUsers(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('UserController.createUser', () => {
  beforeEach(() => {
    req.body = newUser;
  });

  it('should have a createUser function', () => {
    expect(typeof UserController.createUser).toBe('function');
  });

  it('should call models.User.create', () => {
    UserController.createUser(req, res, next);
    expect(models.User.create).toBeCalledWith(newUser);
  });
  it('should return 201 response code', async () => {
    await UserController.createUser(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return json body in response', async () => {
    models.User.create.mockReturnValue(newUser);
    await UserController.createUser(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newUser);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Done property missing' };
    const rejectedPromise = Promise.reject(errorMessage);
    models.User.create.mockReturnValue(rejectedPromise);
    await UserController.createUser(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
