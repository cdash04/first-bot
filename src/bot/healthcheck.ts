import { createServer } from 'net';

export const healthCheckServer = createServer((socket) => {
  // 'connection' listener
  console.log('client connected');
  socket.on('end', () => {
    console.log('client disconnected');
  });
  socket.write('Healthcheck: OK\n');
  socket.pipe(socket);
});
