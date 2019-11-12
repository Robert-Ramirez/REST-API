const httpMocks = require('node-mocks-http');
const TaskController = require('../../controllers/taskController');
const models = require('../../database/models');
const newTask = require('../mock-data/new-task.json');
const allTasks = require('../mock-data/all-task.json');

jest.mock('../../database/models');

let req;
let res;
let next;
const TaskId = '1';
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('TaskController.deleteTask', () => {
  it('should have a deleteTask function', () => {
    expect(typeof TaskController.deleteTask).toBe('function');
  });
  it('should delete with models.Task.update', async () => {
    req.params.taskId = TaskId;
    req.body = newTask;
    await TaskController.deleteTask(req, res, next);

    expect(models.Task.update).toHaveBeenCalledWith(
      {
        active: false
      },
      { where: { id: [req.params.taskId] } }
    );
  });
  it('should return a response with json data and http code 200', async () => {
    req.params.taskId = TaskId;
    req.body = newTask;
    models.Task.update.mockReturnValue(newTask);
    await TaskController.deleteTask(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTask);
  });

  it('should handle errors', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    models.Task.update.mockReturnValue(rejectedPromise);
    await TaskController.deleteTask(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('TaskController.updateTask', () => {
  it('should have a updateTask function', () => {
    expect(typeof TaskController.updateTask).toBe('function');
  });
  it('should update with models.Task.update', async () => {
    req.params.taskId = TaskId;
    req.body = newTask;
    await TaskController.updateTask(req, res, next);

    expect(models.Task.update).toHaveBeenCalledWith(
      {
        name: newTask.name,
        duration: newTask.duration,
        description: newTask.description,
        active: newTask.active
      },
      { where: { id: [req.params.taskId] } }
    );
  });

  it('should return a response with json data and http code 200', async () => {
    req.params.taskId = TaskId;
    req.body = newTask;
    models.Task.update.mockReturnValue(newTask);
    await TaskController.updateTask(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTask);
  });

  it('should handle errors', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    models.Task.update.mockReturnValue(rejectedPromise);
    await TaskController.updateTask(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('TaskController.getTask', () => {
  it('should have a getTask', () => {
    expect(typeof TaskController.getTask).toBe('function');
  });

  it('should call models.Task.findOne with route parameters', async () => {
    req.params.taskId = '5d5ecb5a6e598605f06cb945';
    await TaskController.getTask(req, res, next);
    expect(models.Task.findOne).toBeCalledWith({
      where: { id: req.params.taskId, active: true }
    });
  });

  it('should return json body and response code 200', async () => {
    models.Task.findOne.mockReturnValue(newTask);
    await TaskController.getTask(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTask);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should do error handling', async () => {
    const errorMessage = { message: 'error finding TaskModel' };
    const rejectedPromise = Promise.reject(errorMessage);
    models.Task.findOne.mockReturnValue(rejectedPromise);
    await TaskController.getTask(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('TaskController.getAllTasks', () => {
  it('should have a getAllTasks function', () => {
    expect(typeof TaskController.getAllTasks).toBe('function');
  });

  it('should call models.Task.findAll({})', async () => {
    await TaskController.getAllTasks(req, res, next);
    expect(models.Task.findAll).toHaveBeenCalledWith({
      where: { active: true }
    });
  });

  it('should return response with status 200 and all Tasks', async () => {
    models.Task.findAll.mockReturnValue(allTasks);
    await TaskController.getAllTasks(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allTasks);
  });

  it('should handle errors in getAllTasks', async () => {
    const errorMessage = { message: 'TaskModel is not defined' };
    const rejectedPromise = Promise.reject(errorMessage);
    models.Task.findAll.mockReturnValue(rejectedPromise);
    await TaskController.getAllTasks(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('TaskController.createTask', () => {
  beforeEach(() => {
    req.body = newTask;
  });

  it('should have a createTask function', () => {
    expect(typeof TaskController.createTask).toBe('function');
  });
  it('should call models.Task.create', () => {
    TaskController.createTask(req, res, next);
    expect(models.Task.create).toBeCalledWith(newTask);
  });
  it('should return 200 response code', async () => {
    await TaskController.createTask(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return json body in response', async () => {
    models.Task.create.mockReturnValue(newTask);
    await TaskController.createTask(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTask);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Done property missing' };
    const rejectedPromise = Promise.reject(errorMessage);
    models.Task.create.mockReturnValue(rejectedPromise);
    await TaskController.createTask(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
