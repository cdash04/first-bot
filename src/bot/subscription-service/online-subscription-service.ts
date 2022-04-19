/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiClient } from '@twurple/api';

export const createOnlineSubscriptionService = (twitchApi: ApiClient) => {
  const getChannelId = async (channelName: string) =>
    (await twitchApi.users.getUserByName(channelName)).id;

  const getOnlineEvents = async () => {
    return twitchApi.eventSub.getSubscriptionsForType('stream.online');
  };

  const channelHasOnlineEventSubsciption = async (channelId: string) =>
    (await getOnlineEvents()).data.some(
      (onlineEvent) => onlineEvent.condition?.broadcaster_user_id === channelId,
    );

  const subscribeToOnlineEvent = async (channelName: string) => {
    const channelId = await getChannelId(channelName);

    if (channelHasOnlineEventSubsciption(channelId)) {
      return;
    }

    twitchApi.eventSub.subscribeToStreamOnlineEvents(channelId, {
      method: 'webhook',
      callback: `${process.env.APP_API_URL}/events/online`,
      secret: process.env.TWITCH_EVENT_SUB_LISTENER_SECRET,
    });
  };

  return {
    subscribeToOnlineEvent,
  };
};

export type OnlineSubscriptionService = ReturnType<
  typeof createOnlineSubscriptionService
>;
