const request = require('supertest');
const app = require('../../app');
const currUser = require('../mock-data/curr-user.json');

const endpointUrl = '/api/v1/user/';
let currUserId;

describe(endpointUrl, () => {
  it(`POST ${endpointUrl}login`, async () => {
    const response = await request(app)
      .post(`${endpointUrl}login`)
      .send(currUser);
    expect(response.statusCode).toBe(200);
    currUserId = response.body.id;
  });
  it(`should return error 500 on malformed data with POST${endpointUrl}signup`, async () => {
    const response = await request(app)
      .post(`${endpointUrl}login`)
      .send({ email: 'Missing done property' });
    expect(response.statusCode).toBe(500);
  });
});
