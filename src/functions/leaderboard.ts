import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';
import { viewerReposiroty } from '../repository/dynamo-repository';
import { challengeWebhookMiddleware } from '../middlewares/challenge-webhook';
import { corsMiddleware } from '../middlewares/cors';
import { eventSubSecret } from '../middlewares/event-sub-secret';

const api = createAPI({});

api.use(corsMiddleware);
api.use(challengeWebhookMiddleware);
api.use(eventSubSecret);

api.get('/leaderboards/:broadcaster', async (req: Request, res: Response) => {
  const { broadcaster: broadcasterName } = req.params;

  if (!broadcasterName) {
    return res.status(401).json({ message: 'no broadcaster provided' });
  }

  const viewers = await viewerReposiroty.find({ broadcasterName });

  const leaderboard = viewers
    .sort((viewerOne, viewerTwo) => viewerTwo.firstCount - viewerOne.firstCount)
    .reduce(
      (message, viewer, i) =>
        `${message}\n #${i + 1}: @${viewer.name} with ${
          viewer.firstCount
        } first(s)`,
      '',
    );

  return res.status(200).json({ message: leaderboard });
});

export const handler = async (event: APIGatewayEvent, context: Context) => {
  return api.run(event, context);
};
