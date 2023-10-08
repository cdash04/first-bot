/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiClient } from '@twurple/api';

export const createOnlineSubscriptionService = (twitchApi: ApiClient) => {
  const getOnlineEvents = async () =>
    twitchApi.eventSub.getSubscriptionsForType('stream.online');

  const channelHasOnlineEventSubsciption = async (channelId: string) => {
    const { data } = await getOnlineEvents();
    return data.some(
      (onlineEvent) => onlineEvent.condition?.broadcaster_user_id === channelId,
    );
  };

  const subscribeToOnlineEvent = async (channelId: string) => {
    if (await channelHasOnlineEventSubsciption(channelId)) {
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
