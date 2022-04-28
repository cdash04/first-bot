import { ChatUserstate, Client } from 'tmi.js';
import { apiClient } from '../api-client';
import { messageHasCommand } from '../utils/message-command';

enum Command {
  First = 'first',
  LeaderBoard = 'leaderboard',
  PersonalBest = 'pb',
  CurrentStreak = 'streak',
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
      chatClient.say(target, message);
    };

    if (messageHasCommand(message, Command.First)) {
      const result = await apiClient.post<MessageResponse>('/firsts', {
        broadcaster,
        viewer: username,
      });
      sayMessage(result);
      return;
    }

    if (messageHasCommand(message, Command.LeaderBoard)) {
      const result = await apiClient.get<MessageResponse>(
        `/leaderboards/${broadcaster}`,
      );
      sayMessage(result);
      return;
    }

    if (messageHasCommand(message, Command.PersonalBest)) {
      const result = await apiClient.get<MessageResponse>(
        `/first/${broadcaster}/${username}`,
      );
      sayMessage(result);
      return;
    }

    if (messageHasCommand(message, Command.CurrentStreak)) {
      const result = await apiClient.get<MessageResponse>(
        `/leaderboards/${broadcaster}/current-streak`,
      );
      sayMessage(result);
    }
  };
