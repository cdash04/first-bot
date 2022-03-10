import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';

import { corsMiddleware } from '../middlewares/cors';

const api = createAPI();

api.get('/events', async (req: Request, res: Response) => {
  return { status: 'ok' };
});

api.use(corsMiddleware);

const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log({ event }); // log the event
  return api.run(event, context);
};

export default handler;
