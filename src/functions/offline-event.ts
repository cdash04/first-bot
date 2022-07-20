import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';
import { broadcasterRepository } from '../repository/dynamo-repository';
import { challengeWebhookMiddleware } from '../middlewares/challenge-webhook';
import { corsMiddleware } from '../middlewares/cors';
import { eventSubSecret } from '../middlewares/event-sub-secret';

const api = createAPI({});

api.use(corsMiddleware);
api.use(challengeWebhookMiddleware);
api.use(eventSubSecret);

api.post('/events/offline', async (req: Request, res: Response) => {
  const broadcasterName: string = (
    req.body?.event?.broadcaster_user_name as string
  )?.toLowerCase();

  if (!broadcasterName) {
    return res.status(400);
  }

  const broadcaster = await broadcasterRepository.get({
    name: broadcasterName,
  });

  if (!broadcaster) {
    return res
      .status(401)
      .json({ message: `broadcaster ${broadcasterName} not found` });
  }

  await broadcasterRepository.update(
    { name: broadcasterName },
    { set: { online: false, firstIsRedeemed: false, bits: 0 } },
  );

  return res
    .status(200)
    .json({ message: `${broadcasterName} is now set offline` });
});

export const handler = async (event: APIGatewayEvent, context: Context) => {
  return api.run(event, context);
};
