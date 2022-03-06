import request from 'supertest';
import { app } from '../app';

describe('Error page', () => {
  it('should return 404 for not existing page', (done) => {
    request(app).get('/fake-page').end((err, res) => {
      expect(res.statusCode).toBe(404);
      done();
    });
  });
});
