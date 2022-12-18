import { apiClient } from '../api-client';

const initBroadcaster = (broadcaster: string) =>
  apiClient.post('/broadcasters', { broadcaster });

export default { initBroadcaster };
