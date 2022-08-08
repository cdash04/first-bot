import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';
import { viewerRepository } from '../repository/dynamo-repository';
import { corsMiddleware } from '../middlewares/cors';

const api = createAPI({});

api.use(corsMiddleware);

api.get('/leaderboards/:broadcaster', async (req: Request, res: Response) => {
  const { broadcaster: broadcasterName } = req.params;

  console.log({ broadcasterName });

  if (!broadcasterName) {
    return res.status(401).json({ message: 'no broadcaster provided' });
  }

  const viewers = await viewerRepository.find({ broadcasterName });

  console.log({ viewers });

  const leaderboard = viewers
    .sort((viewerOne, viewerTwo) => viewerTwo.firstCount - viewerOne.firstCount)
    .filter((viewer) => viewer.firstCount)
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
