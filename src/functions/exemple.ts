import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';
import { corsMiddleware } from '../middlewares/cors';

const api = createAPI();

api.get('/status', async (req: Request, res: Response) => {
  return { status: 'ok' };
});

api.use(corsMiddleware);

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log({ event }); // log the event
  return api.run(event, context);
};
