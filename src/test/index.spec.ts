import request from 'supertest';
import { app } from '../app';

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  it('should return Hello Express', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        expect(res.text).toContain('Hello Express');
        done();
      });
  });
});
