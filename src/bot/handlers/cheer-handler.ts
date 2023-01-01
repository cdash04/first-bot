import { ChatUserstate, Client } from 'tmi.js';
import { apiClient } from '../api-client';
import { messageHasCommand } from '../utils/message-command';

enum Command {
  First = 'first',
}

interface MessageResponse {
  message: string;
}

export const cheerHandler =
  (chatClient: Client) =>
  async (
    channel: string,
    userstate: ChatUserstate,
    message: string,
  ): Promise<void> => {
    const {
      username: viewer,
      id: viewerId,
      'room-id': broadcasterId,
      bits,
    } = userstate;
    const broadcaster = channel.replace('#', '');

    const sayMessage = async ({
      data: { message },
    }: {
      data: MessageResponse;
    }) => {
      chatClient.say(channel, message);
    };

    if (messageHasCommand(message, Command.First)) {
      const result = await apiClient.post<MessageResponse>('/firsts/steal', {
        broadcaster,
        broadcasterId,
        viewer,
        viewerId,
        bits,
      });
      sayMessage(result);
    }
  };
