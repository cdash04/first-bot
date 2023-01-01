import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';
import { broadcasterRepository } from '../repository/dynamo-repository';
import { challengeWebhookMiddleware } from '../middlewares/challenge-webhook';
import { eventSubSecret } from '../middlewares/event-sub-secret';
import { corsMiddleware } from '../middlewares/cors';

const api = createAPI({ logger: true });

api.use(corsMiddleware);
api.use(challengeWebhookMiddleware);
api.use(eventSubSecret);

api.post('/events/online', async (req: Request, res: Response) => {
  const broadcasterId: string = (
    req.body?.event?.broadcaster_user_id as string
  )?.toLowerCase();
  const broadcasterName: string = (
    req.body?.event?.broadcaster_user_name as string
  )?.toLowerCase();

  if (!broadcasterId) {
    return res.status(400);
  }

  const broadcaster = await broadcasterRepository.get({
    id: broadcasterId,
  });

  if (!broadcaster) {
    return res
      .status(401)
      .json({ message: `broadcaster ${broadcasterName} not found` });
  }

  await broadcasterRepository.update(
    { id: broadcasterId },
    {
      set: {
        name: broadcasterName,
        online: true,
        firstIsRedeemed: false,
        bits: 0,
      },
    },
  );

  return res
    .status(200)
    .json({ message: `${broadcasterName} is now set online` });
});

export const handler = async (event: APIGatewayEvent, context: Context) => {
  return api.run(event, context);
};
