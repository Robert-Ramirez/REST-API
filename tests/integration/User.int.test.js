const request = require('supertest');
const app = require('../../app');
//const newUser = require('../mock-data/new-user.json');
const currUser = require('../mock-data/curr-user.json');

const endpointUrl = '/api/v1/user/';

describe(endpointUrl, () => {
  it(`POST ${endpointUrl}signup error handling`, () => {
    return request(app)
      .post(`${endpointUrl}signup`)
      .send({ email: 'Missing done property' })
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });
  /*
  it(`POST ${endpointUrl}signup return json`, () => {
    return request(app)
      .post(`${endpointUrl}signup`)
      .send(newUser)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });
  */

  it(`POST ${endpointUrl}login error handling`, () => {
    return request(app)
      .post(`${endpointUrl}login`)
      .send({ email: 'Missing done property' })
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });
  it(`POST ${endpointUrl}login return json`, () => {
    return request(app)
      .post(`${endpointUrl}login`)
      .send(currUser)
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });

  it(`POST ${endpointUrl}forgotPassworderror handling`, () => {
    return request(app)
      .post(`${endpointUrl}forgotPassword`)
      .send({ email: 'Missing done property' })
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });
  it(`POST ${endpointUrl}forgotPassword return json`, () => {
    return request(app)
      .post(`${endpointUrl}forgotPassword`)
      .send({ email: 'jondoeeabcdefgh@gmail.com' })
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
      });
  });
});
