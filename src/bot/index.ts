import TMI, { Options } from 'tmi.js';
import { program } from 'commander';

import { twitchClient } from './twitch-client';
import { messageHandler } from './handlers/message-handler';
import { cheerHandler } from './handlers/cheer-handler';
import {
  broadcasterService,
  createOfflineSubscriptionService,
  createOnlineSubscriptionService,
} from './services';
import { healthCheckServer } from './healthcheck';

program.option(
  '-c, --channels <string>',
  'channels chat the bot will listen to',
);
program.parse();

const { channels: channelsArgument } = program.opts<{ channels: string }>();
const channels = channelsArgument.split(',').map((channel) => channel.trim());

const botName = process.env.BOT_NAME;
const tmiOauth = process.env.TWITCH_TMI_OAUTH;

const onlineSubscriptionService = createOnlineSubscriptionService(twitchClient);
const offlineSubscriptionService =
  createOfflineSubscriptionService(twitchClient);

const initChatBot = () =>
  Promise.all(
    channels.map(async (channel) => {
      const username = channel.replace('#', '');
      await broadcasterService.initBroadcaster(username);
      await onlineSubscriptionService.subscribeToOnlineEvent(username);
      await offlineSubscriptionService.subscribeToOfflineEvent(username);
    }),
  );

// TMI listener setup
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
  .on('connecting', initChatBot)
  .on('message', messageHandler(chatClient))
  .on('cheer', cheerHandler(chatClient));

chatClient.connect();

healthCheckServer.listen(8000, () => {
  console.log('Server running on port 8000');
});
