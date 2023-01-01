import { apiClient } from '../api-client';
import { twitchClient } from '../twitch-client';

const initBroadcaster = async (broadcasterName: string) => {
  const broadcasterId = (
    await twitchClient.users.getUserByName(broadcasterName)
  ).id;
  apiClient.post('/broadcasters', { broadcasterId, broadcasterName });
};

export default { initBroadcaster };
