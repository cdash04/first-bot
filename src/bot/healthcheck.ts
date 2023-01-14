import { createServer } from 'http';

export const healthCheckServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Healthcheck: OK');
});
