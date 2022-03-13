import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';
import { challengeWebhookMiddleware } from '../middlewares/challenge-webhook';

import { corsMiddleware } from '../middlewares/cors';

const api = createAPI({});

api.post('/online-events/', async (req: Request, res: Response) => {
  console.log({ req, res });
  res.status(200);
});

api.use(corsMiddleware);
api.use(challengeWebhookMiddleware);

export const handler = async (event: APIGatewayEvent, context: Context) => {
  return api.run(event, context);
};
