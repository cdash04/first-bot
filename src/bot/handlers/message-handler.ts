import { ChatUserstate, Client } from 'tmi.js';
import { apiClient } from '../api-client';
import { messageHasCommand } from '../utils/message-command';

enum Command {
  First = 'first',
}

interface MessageResponse {
  message: string;
}

export const messageHandler =
  (chatClient: Client) =>
  (target: string, tags: ChatUserstate, message: string, self: boolean) => {
    const broadcaster = target.replace('#', '');
    const { username } = tags;

    const sayMessage = async ({
      data: { message },
    }: {
      data: MessageResponse;
    }) => {
      console.log({ message });
      await chatClient.say(target, message);
    };

    if (messageHasCommand(message, Command.First)) {
      return apiClient
        .post<MessageResponse>('/firsts', {
          broadcaster,
          viewer: username,
        })
        .then(sayMessage);
    }
  };
