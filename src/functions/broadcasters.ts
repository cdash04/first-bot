import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';

import { broadcasterRepository } from '../repository/dynamo-repository';

import { corsMiddleware } from '../middlewares/cors';

const api = createAPI({ logger: true });

api.use(corsMiddleware);

api.post('/broadcasters', async (req: Request, res: Response) => {
  console.log({ body: req.body });
  const { broadcaster: broadcasterName } = req.body;

  // get broadcaster
  let broadcaster = await broadcasterRepository.get({
    name: broadcasterName,
  });

  // when broadcaster is new, viewer is first and must be new
  if (!broadcaster) {
    broadcaster = await broadcasterRepository.create({
      name: broadcasterName,
      online: false,
      firstIsRedeemed: false,
      currentFirstStreak: 0,
    });
  }

  return res.status(200).json({ broadcaster });
});

api.get(
  '/broadcasters/:broadcaster/current-streak',
  async (req: Request, res: Response) => {
    const { broadcaster: broadcasterName } = req.params;

    const broadcaster = await broadcasterRepository.get({
      name: broadcasterName,
    });

    // when broadcaster does not exist
    if (!broadcaster) {
      return res
        .status(401)
        .json({ message: `broadcaster @${broadcasterName} not found` });
    }

    // when broadcaster has no first yet
    if (!broadcaster.currentFirstStreak) {
      return res.status(202).json({
        message: `No first has been redeemed yet with @${broadcaster.name}, quick, it might be you.`,
      });
    }

    return res.status(200).json({
      message: `Current streak hold by @${broadcaster.currentFirstViewer} with ${broadcaster.currentFirstStreak} first(s)`,
    });
  },
);

export const handler = async (event: APIGatewayEvent, context: Context) => {
  return api.run(event, context);
};
