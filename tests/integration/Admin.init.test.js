const request = require('supertest');
const app = require('../../app');
const currUser = require('../mock-data/curr-user.json');
const newUser = require('../mock-data/new-user.json');

const endpointUrl = '/api/v1/user/';
let token;
let firstUser;

beforeAll(done => {
  request(app)
    .post(`${endpointUrl}login`)
    .send(currUser)
    .end((err, res) => {
      firstUser = res.body.user;
      token = res.body.token; // save the token!
      done();
    });
});

describe(endpointUrl, () => {
  test('GetAllUsers with Admin check for error handling', () => {
    return request(app)
      .get(`${endpointUrl}`)
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });
  test('GetAllUsers with Admin should return json', () => {
    return request(app)
      .get(`${endpointUrl}`)
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });

  test('GetUser with Admin check for error handling', () => {
    return request(app)
      .get(`${endpointUrl}${firstUser.id}`)
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });
  test('GetUser with Admin should return json', () => {
    return request(app)
      .get(`${endpointUrl}${firstUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });

  it('CreateUser with Admin check for error handling', () => {
    return request(app)
      .post(`${endpointUrl}`)
      .send(newUser)
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });
  /*
  it('CreateUser with Admin should return json', () => {
    return request(app)
      .post(`${endpointUrl}`)
      .send(newUser)
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        newUser.id = res.body.id;
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });
  */

  it('UpdateUser with Admin check for error handling', () => {
    return request(app)
      .patch(`${endpointUrl}${firstUser.id}`)
      .send({ email: 'Dave' })
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });
  it('UpdateUser with Admin should return json', () => {
    return request(app)
      .patch(`${endpointUrl}${firstUser.id}`)
      .send({ name: 'Dave' })
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });

  it('DeleteUser with Admin check for error handling', () => {
    return request(app)
      .delete(`${endpointUrl}${newUser.id}`)
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });

  /*
  it('DeleteUser with Admin should return json', () => {
    return request(app)
      .delete(`${endpointUrl}${newUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });
*/
  it('UpdatePassWord with Admin check for error handling', () => {
    return request(app)
      .patch(`${endpointUrl}updateMyPassword`)
      .send({ passwordCurrent: '12345678', password: '12345678' })
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });
  it('UpdatePassword with Admin should return json', () => {
    return request(app)
      .patch(`${endpointUrl}updateMyPassword`)
      .send({ passwordCurrent: '12345678', password: '12345678' })
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });
});
