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
  const broadcasterName: string = req.body?.event?.broadcaster_user_name;

  if (!broadcasterName) {
    return res.status(400);
  }

  const broadcaster = await broadcasterRepository.get({
    name: broadcasterName,
  });

  if (!broadcaster) {
    await broadcasterRepository.create({
      name: broadcasterName,
      online: true,
      firstIsRedeemed: false,
      currentFirstStreak: 0,
    });
  } else {
    await broadcasterRepository.update(
      { name: broadcasterName },
      { set: { online: true, firstIsRedeemed: false } },
    );
  }

  return res.status(200);
});

export const handler = async (event: APIGatewayEvent, context: Context) => {
  return api.run(event, context);
};
