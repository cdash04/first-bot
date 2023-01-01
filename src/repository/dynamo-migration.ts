/* eslint-disable prefer-destructuring */
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';

import { broadcasterRepository, viewerRepository } from './dynamo-repository';

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

async function migrate() {
  const results = await broadcasterRepository.scan();
  results.forEach(async ({ pk, sk, name, id, currentFirstViewer }) => {
    if (currentFirstViewer) {
      const currentFirstViewerId = (
        await viewerRepository.get({
          broadcasterId: id,
          name: currentFirstViewer,
        })
      ).id;
      console.log({ currentFirstViewer, currentFirstViewerId });
      broadcasterRepository.update({
        id,
        currentFirstViewer: currentFirstViewerId,
      });
    }
  });
}

(async () => migrate())();
