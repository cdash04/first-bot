import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import TMI, { ChatUserstate, Options } from 'tmi.js';
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

channels.forEach(async (channel) => {
  await broadcasterService.initBroadcaster(channel);
  onlineSubscriptionService.subscribeToOnlineEvent(channel);
  offlineSubscriptionService.subscribeToOfflineEvent(channel);
});

// TMI listener setup
const TMI_OPTIONS: Options = {
  identity: {
    username: botName,
    password: tmiOauth,
  },
  channels,
};

const chatClient = new TMI.Client(TMI_OPTIONS);

const onConnectedHandler = async (addr: string, port: number) => {
  console.log(`Successfully Connected to ${addr}:${port}`);
};

function logMessage(
  target: string,
  tags: ChatUserstate,
  message: string,
  self: boolean,
) {
  if (self) {
    return;
  }

  const trimmedMessage = message.trim();

  // log every message
  console.log(`${target}, ${tags.username}: "${trimmedMessage}"`);
}

chatClient
  .on('connected', onConnectedHandler)
  .on('message', logMessage)
  .on('message', messageHandler(chatClient));

chatClient.connect();
