import { ApiClient } from '@twurple/api/lib';

export const getOnlineSubscriptionService = (twitchApi: ApiClient) => {
  const getChannelId = async (channelName: string) =>
    (await twitchApi.users.getUserByName(channelName)).id;

  const getOnlineEvents = async () => {
    return twitchApi.eventSub.getSubscriptionsForType('stream.online');
  };

  const channelHasOnlineEventSubsciption = async (channelId: string) => {
    return (await getOnlineEvents()).data.some(
      (onlineEvent) =>
        (onlineEvent.condition?.broadcaster_user_id === channelId &&
          onlineEvent.condition?.callback === (process.env.ONLINE_EVENT_URL ??
            'api.bot.cda.sh/events/online')),
    );
  };

  const subscribeToOnlineEvent = async (channelName: string) => {
    const channelId = await getChannelId(channelName);

    if (channelHasOnlineEventSubsciption) {
      return;
    }

    twitchApi.eventSub.subscribeToStreamOnlineEvents(channelId, {
      method: 'webhook',
      callback: process.env.ONLINE_EVENT_URL ?? 'api.bot.cda.sh/events/online',
      secret: process.env.EVENT_SUB_SECRET,
    });
  };

  return { subscribeToOnlineEvent };
};

export type OnlineSubscriptionService = ReturnType<
  typeof getOnlineSubscriptionService
>;
