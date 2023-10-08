/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiClient } from '@twurple/api';

export const createOfflineSubscriptionService = (twitchApi: ApiClient) => {
  const getOfflineEvents = async () =>
    twitchApi.eventSub.getSubscriptionsForType('stream.offline');

  const channelHasOfflineEventSubsciption = async (channelId: string) =>
    (await getOfflineEvents()).data.some(
      (offlineEvent) =>
        offlineEvent.condition?.broadcaster_user_id === channelId,
    );

  const subscribeToOfflineEvent = async (channelId: string) => {
    if (await channelHasOfflineEventSubsciption(channelId)) {
      return;
    }

    twitchApi.eventSub.subscribeToStreamOfflineEvents(channelId, {
      method: 'webhook',
      callback: `${process.env.APP_API_URL}/events/offline`,
      secret: process.env.TWITCH_EVENT_SUB_LISTENER_SECRET,
    });
  };

  return {
    subscribeToOfflineEvent,
  };
};

export type OfflineSubscriptionService = ReturnType<
  typeof createOfflineSubscriptionService
>;
