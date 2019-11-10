const request = require('supertest');
const app = require('../../app');

describe('Post Endpoints', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/v1/task/')
      .send({
        name: 'Study',
        duration: 4,
        description: 'Testing.',
        active: true,
        userId: 1
      });
    expect(res.statusCode).toEqual(200);
  });
});
