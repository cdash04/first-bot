import { ChatUserstate, Client } from 'tmi.js';
import { apiClient } from '../api-client';
import { messageHasCommand } from '../utils/message-command';

enum Command {
  First = 'first',
  LeaderBoard = 'leaderboard',
  PersonalBest = 'pb',
  CurrentStreak = 'streak',
  FirstBotName = 'firstBot',
  Credits = 'botCredits',
  Commands = 'firstBotCommands',
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
    // do not consider message sent by the bot
    if (self) {
      return;
    }

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
        `/firsts/${broadcaster}/${username}`,
      );
      sayMessage(result);
      return;
    }

    if (messageHasCommand(message, Command.CurrentStreak)) {
      const result = await apiClient.get<MessageResponse>(
        `/broadcasters/${broadcaster}/current-streak`,
      );
      sayMessage(result);
      return;
    }

    if (messageHasCommand(message, Command.Commands)) {
      sayMessage({
        data: {
          message: Object.values(Command).reduce(
            (message, command) => `${message} !${command}`,
            '',
          ),
        },
      });
      return;
    }

    if (
      messageHasCommand(message, Command.Credits) ||
      messageHasCommand(message, Command.FirstBotName)
    ) {
      sayMessage({
        data: {
          message:
            'FirstBot is an open source, self hosting solution to know who is the first in your chat. Follow me on Github: https://github.com/cdash04, twitch https://www.twitch.tv/cdash01/ or discord: https://discord.gg/dSBZZyyybH :)',
        },
      });
    }
  };
