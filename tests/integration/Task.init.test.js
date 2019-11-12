const request = require('supertest');
const app = require('../../app');
const currUser = require('../mock-data/curr-user.json');
const newTask = require('../mock-data/new-task.json');

const endpointUrl = '/api/v1/task/';
let token;
let currTask;
let firstUser;

beforeAll(done => {
  request(app)
    .post(`/api/v1/user/login`)
    .send(currUser)
    .end((err, res) => {
      firstUser = res.body.user;
      token = res.body.token;
      done();
    });
});

describe(endpointUrl, () => {
  test('GetAllTasks with Admin check for error handling', () => {
    return request(app)
      .get(`${endpointUrl}`)
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });
  test('GetAllTasks with Admin should return json', () => {
    return request(app)
      .get(`${endpointUrl}`)
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });

  it('CreateTask with Admin check for error handling', () => {
    return request(app)
      .post(`${endpointUrl}`)
      .send(newTask)
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });

  it('CreateTask with Admin should return json', () => {
    return request(app)
      .post(`${endpointUrl}`)
      .send(newTask)
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        currTask = res.body;
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });

  test('GetTask with Admin id check for error handling', () => {
    return request(app)
      .get(`/api/v1/user/${firstUser.id}/task`)
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });
  test('GetTask with Admin id should return json', () => {
    return request(app)
      .get(`/api/v1/user/${firstUser.id}/task`)
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });

  test('GetTasks with task id check for error handling', () => {
    return request(app)
      .get(`${endpointUrl}${currTask.id}`)
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });
  test('GetTasks with task id should return json', () => {
    return request(app)
      .get(`${endpointUrl}${currTask.id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });

  it('UpdateTask with Admin check for error handling', () => {
    return request(app)
      .patch(`${endpointUrl}${currTask.id}`)
      .send({ duration: 5 })
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });
  it('UpdateTask with Admin should return json', () => {
    return request(app)
      .patch(`${endpointUrl}${currTask.id}`)
      .send({ duration: 5 })
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });

  it('DeleteTask with Admin check for error handling', () => {
    return request(app)
      .delete(`${endpointUrl}${currTask.id}`)
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });

  it('DeleteTask with Admin should return json', () => {
    return request(app)
      .delete(`${endpointUrl}${currTask.id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });
});
