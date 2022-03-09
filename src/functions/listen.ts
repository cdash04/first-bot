import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { EventSubSubscription } from '@twurple/eventsub';

import { corsMiddleware } from '../middlewares/cors';

const clientId = 'gc9ksc49d6tzfj3yjvk7t8889xpilt';
const clientSecret = 'er19fm5cjh9y1a5vo7o3drkhscpunq';

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

const api = createAPI();

api.get('/events', async (req: Request, res: Response) => {
  return { status: 'ok' };
});

api.use(corsMiddleware);

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log({ event }); // log the event
  return api.run(event, context);
};
