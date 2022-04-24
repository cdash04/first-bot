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
  async (
    target: string,
    tags: ChatUserstate,
    message: string,
    self: boolean,
  ): Promise<void> => {
    const broadcaster = target.replace('#', '');
    const { username } = tags;

    const sayMessage = async ({
      data: { message },
    }: {
      data: MessageResponse;
    }) => {
      await chatClient.say(target, message);
    };

    if (messageHasCommand(message, Command.First)) {
      const result = await apiClient.post<MessageResponse>('/firsts', {
        broadcaster,
        viewer: username,
      });
      sayMessage(result);
    }
  };
