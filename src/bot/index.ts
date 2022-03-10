import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { EventSubListener } from '@twurple/eventsub';
import TMI, { ChatUserstate, Options } from 'tmi.js';
import { NgrokAdapter } from '@twurple/eventsub-ngrok';

import { messageHandler } from './handlers/message-handler';

// channels
const channels = [
  'todjrekt',
  'jbezzo',
  'josnib',
  'knifebyt',
  'cdash01',
  'fussybalel',
  'robzen42',
  'patkilo',
];

// creds, to delete and put into secrets later
const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const botName = process.env.BOT_NAME;
const tmiOauth = process.env.TWITCH_TMI_OAUTH;

// setup Twitch client
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

// setup twitch EventSub Middleware server
const listener = new EventSubListener({
  apiClient,
  adapter: new NgrokAdapter(),
  secret: process.env.TWITCH_EVENT_SUB_LISTENER_SECRET,
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

apiClient.users.getUserByName('josnib').then(async (user) => {
  const channel = await apiClient.channels.getChannelInfo(user.id);
  console.log({ ...channel });
  await listener.subscribeToChannelFollowEvents(channel.id, (event) => {
    console.log({ event });
  });
});

chatClient
  .on('connected', onConnectedHandler)
  .on('message', logMessage)
  .on('message', messageHandler);

chatClient.connect();
// listener.listen();
