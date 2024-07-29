import request from 'supertest';
import app from '../app';

it('should return 200', async () => {
  await request(app).get('/').expect(200);
});
