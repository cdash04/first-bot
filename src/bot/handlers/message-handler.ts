import { ChatUserstate, Client } from 'tmi.js';
import { apiClient } from '../api-client';
import { messageHasCommand } from '../utils/message-command';

enum Command {
  First = 'first',
}

export const messageHandler =
  (chatClient: Client) =>
  (target: string, tags: ChatUserstate, message: string, self: boolean) => {
    if (messageHasCommand(message, Command.First)) {
      apiClient
        .post('/firsts', { broadcaster: target, viewer: tags.username })
        .then(({ data }) => {
          console.log({ data });
        });
    }
  };
