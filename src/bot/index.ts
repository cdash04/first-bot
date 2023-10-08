import TMI, { Options } from 'tmi.js';

import { twitchClient } from './twitch-client';
import { messageHandler } from './handlers/message-handler';
import { cheerHandler } from './handlers/cheer-handler';
import {
  broadcasterService,
  createOfflineSubscriptionService,
  createOnlineSubscriptionService,
} from './services';

const botName = process.env.BOT_NAME;
const tmiOauth = process.env.TWITCH_TMI_OAUTH;

const onlineSubscriptionService = createOnlineSubscriptionService(twitchClient);
const offlineSubscriptionService =
  createOfflineSubscriptionService(twitchClient);

// Get broadcasters and setup
const channelIds = broadcasterService
  .getBroadcasters()
  .then(({ broadcasters }) => {
    Promise.all(
      broadcasters
        .map(({ id }) => [
          onlineSubscriptionService.subscribeToOnlineEvent(id),
          offlineSubscriptionService.subscribeToOfflineEvent(id),
        ])
        .flat(),
    );
    return broadcasters.map(({ id }) => id);
  });

// Get broadcasters channel names
const channelUsers = channelIds.then((channelIds) =>
  twitchClient.users.getUsersByIds(channelIds),
);

// Setup and start bot lis
channelUsers.then((channelUsers) => {
  // TMI listener setup
  const channels = channelUsers.map(({ name }) => name);
  const TMI_OPTIONS: Options = {
    options: {},
    identity: {
      username: botName,
      password: tmiOauth,
    },
    channels,
  };

  const chatClient = new TMI.Client(TMI_OPTIONS);

  chatClient
    .on('connecting', () => {
      console.log('bot connected');
    })
    .on('message', messageHandler(chatClient))
    .on('cheer', cheerHandler(chatClient));

  chatClient.connect();
});
