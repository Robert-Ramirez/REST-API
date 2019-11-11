const request = require('supertest');
const app = require('../../app');
const newUser = require('../mock-data/new-user.json');
const currUser = require('../mock-data/curr-user.json');

const endpointUrl = '/api/v1/user/';
let newUserId;

describe(endpointUrl, () => {
  it(`Post ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(`${endpointUrl}signup`)
      .send(newUser);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      })
    );
    newUserId = response.body.id;
  });
});
