const request = require('supertest');
const app = require('../app');

describe('task Endpoints', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .task('/api/v1/tasks')
      .send({
        userId: 1,
        title: 'test is cool',
        content: 'Lorem ipsum'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('task');
  });

  it('should fetch a single task', async () => {
    const taskId = 1;
    const res = await request(app).get(`/api/v1/tasks/${taskId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('task');
  });

  it('should fetch all tasks', async () => {
    const res = await request(app).get('/api/v1/tasks');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('tasks');
    expect(res.body.tasks).toHaveLength(1);
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put('/api/v1/tasks/1')
      .send({
        userId: 1,
        title: 'updated title',
        content: 'Lorem ipsum'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('task');
    expect(res.body.task).toHaveProperty('title', 'updated title');
  });

  it('should return status code 500 if db constraint is violated', async () => {
    const res = await request(app)
      .task('/api/v1/tasks')
      .send({
        title: 'test is cool',
        content: 'Lorem ipsum'
      });
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error');
  });

  it('should delete a task', async () => {
    const res = await request(app).delete('/api/v1/tasks/1');
    expect(res.statusCode).toEqual(204);
  });

  it('should respond with status code 404 if resource is not found', async () => {
    const taskId = 1;
    const res = await request(app).get(`/api/v1/tasks/${taskId}`);
    expect(res.statusCode).toEqual(404);
  });
});
