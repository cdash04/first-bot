import { ChatUserstate, Client } from 'tmi.js';
import { apiClient } from '../api-client';
import { messageHasCommand } from '../utils/message-command';

enum Command {
  First = 'first',
  LeaderBoard = 'leaderboard',
  PersonalBest = 'pb',
  CurrentStreak = 'current',
  FirstBotName = 'firstBot',
  Credits = 'botCredits',
  Commands = 'firstBotCommands',
  PayToWin = 'payToWin',
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

    const broadcasterName = target.replace('#', '');
    const {
      username: viewerName,
      'user-id': viewerId,
      'room-id': broadcasterId,
    } = tags;

    const sayMessage = async ({
      data: { message },
    }: {
      data: MessageResponse;
    }) => {
      chatClient.say(target, message);
    };

    if (messageHasCommand(message, Command.First)) {
      const result = await apiClient.post<MessageResponse>('/firsts', {
        broadcasterName,
        broadcasterId,
        viewerName,
        viewerId,
      });
      sayMessage(result);
      return;
    }

    if (messageHasCommand(message, Command.LeaderBoard)) {
      const result = await apiClient.get<MessageResponse>(
        `/leaderboards/${broadcasterId}`,
      );
      sayMessage(result);
      return;
    }

    if (messageHasCommand(message, Command.PayToWin)) {
      const result = await apiClient.post<MessageResponse>('/pay-to-win', {
        broadcasterName,
        broadcasterId,
        viewerName,
      });
      sayMessage(result);
      return;
    }

    if (messageHasCommand(message, Command.PersonalBest)) {
      const result = await apiClient.get<MessageResponse>(
        `/firsts/${broadcasterId}/${viewerId}`,
      );
      sayMessage(result);
      return;
    }

    if (messageHasCommand(message, Command.CurrentStreak)) {
      const result = await apiClient.get<MessageResponse>(
        `/broadcasters/${broadcasterId}/current-streak`,
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
