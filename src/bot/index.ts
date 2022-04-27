import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import TMI, { Options } from 'tmi.js';
import { program } from 'commander';

import { messageHandler } from './handlers/message-handler';
import {
  broadcasterService,
  createOfflineSubscriptionService,
  createOnlineSubscriptionService,
} from './services';

program.option(
  '-c, --channels <string>',
  'channels chat the bot will listen to',
);
program.parse();

const { channels: channelsArgument } = program.opts<{ channels: string }>();
const channels = channelsArgument.split(',').map((channel) => channel.trim());

// creds, to delete and put into secrets later
const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const botName = process.env.BOT_NAME;
const tmiOauth = process.env.TWITCH_TMI_OAUTH;

// setup Twitch client
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

const onlineSubscriptionService = createOnlineSubscriptionService(apiClient);
const offlineSubscriptionService = createOfflineSubscriptionService(apiClient);

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
  identity: {
    username: botName,
    password: tmiOauth,
  },
  channels,
};

const chatClient = new TMI.Client(TMI_OPTIONS);

chatClient
  .on('connecting', initChatBot)
  .on('message', messageHandler(chatClient));

chatClient.connect();
