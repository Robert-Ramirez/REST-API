const request = require('supertest');
const app = require('../../app');
const newtask = require('../mock-data/new-task.json');

const endpointUrl = '/tasks/';
let firsttask; let newtaskId;
const nonExistingtaskId = '123456';
const testData = { title: 'Make integration test for PUT', done: true };

describe(endpointUrl, () => {
  test('GET ' + endpointUrl, async () => {
    const response = await request(app).get(endpointUrl);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
    firsttask = response.body[0];
  });
  test('GET by Id ' + endpointUrl + ':taskId', async () => {
    const response = await request(app).get(endpointUrl + firsttask.id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firsttask.title);
    expect(response.body.done).toBe(firsttask.done);
  });
  test(`GET taskby id doesn't exist${  endpointUrl  }:taskId`, async () => {
    const response = await request(app).get(endpointUrl + '123456');
    expect(response.statusCode).toBe(404);
  });
  it('POST ' + endpointUrl, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send(newtask);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newtask.title);
    expect(response.body.done).toBe(newtask.done);
    newtaskId = response.body.id;
  });
  it(
    'should return error 500 on malformed data with POST' + endpointUrl,
    async () => {
      const response = await request(app)
        .post(endpointUrl)
        .send({ title: 'Missing done property' });
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: 'notNull Violation: task.done cannot be null'
      });
    }
  );
  it('PUT ' + endpointUrl, async () => {
    const testData = { title: 'Make integration test for PUT', done: true };
    const res = await request(app)
      .put(endpointUrl + newtaskId)
      .send(testData);
    expect(res.statusCode).toBe(200);
    //expect(res.body.title).toBe(testData.title);
    //expect(res.body.done).toBe(testData.done);
  });
  /*
  it("should return 404 on PUT " + endpointUrl, async () => {
    const testData = { title: "Make integration test for PUT", done: true };
    const res = await request(app)
      .put(endpointUrl + nonExistingtaskId)
      .send(testData);
    expect(res.statusCode).toBe(404);
  });
  */
  test('HTTP DELETE', async () => {
    const res = await request(app)
      .delete(endpointUrl + newtaskId)
      .send();
    expect(res.statusCode).toBe(200);
    //expect(res.body.title).toBe(testData.title);
    //expect(res.body.done).toBe(testData.done);
  });
  test('HTTP DELETE 404', async () => {
    const res = await request(app)
      .delete(endpointUrl + nonExistingtaskId)
      .send();
    expect(res.statusCode).toBe(404);
  });
});
