import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';

import {
  broadcasterRepository,
  viewerRepository,
} from '../repository/dynamo-repository';

import { corsMiddleware } from '../middlewares/cors';

const api = createAPI({ logger: true });

api.use(corsMiddleware);

api.post('/broadcasters', async (req: Request, res: Response) => {
  const { broadcasterId, broadcasterName } = req.body;
  // get broadcaster
  let broadcaster = await broadcasterRepository.get({
    id: broadcasterId,
  });

  // when broadcaster is new, viewer is first and must be new
  if (!broadcaster) {
    broadcaster = await broadcasterRepository.create({
      id: broadcasterId,
      name: broadcasterName,
      online: false,
      firstIsRedeemed: false,
      currentFirstStreak: 0,
      bits: 0,
    });
  }

  return res.status(200).json({ broadcaster });
});

api.get('/broadcasters', async (req: Request, res: Response) => {
  const broadcasters = await broadcasterRepository.scan(
    {},
    { fields: ['name', 'id'] },
  );
  res.status(201).json({ broadcasters });
});

api.get(
  '/broadcasters/:broadcasterId/current-streak',
  async (req: Request, res: Response) => {
    const { broadcasterId } = req.params;

    const broadcaster = await broadcasterRepository.get({
      id: broadcasterId,
    });

    // when broadcaster does not exist
    if (!broadcaster) {
      return res.status(401).json({ message: 'broadcaster was not found' });
    }

    // when broadcaster has no first yet
    if (!broadcaster.currentFirstStreak) {
      return res.status(202).json({
        message: `No first has been redeemed yet for @${broadcaster.name}, quick, it might be you.`,
      });
    }

    const currentViewer = await viewerRepository.get({
      id: broadcaster.currentFirstViewer,
      broadcasterId,
    });

    return res.status(200).json({
      message: `Current streak hold by @${currentViewer.name} with ${
        broadcaster.currentFirstStreak
      } first(s)${
        broadcaster.bits ? ` purchased with ${broadcaster.bits} bit(s)` : ''
      }.`,
    });
  },
);

export const handler = async (event: APIGatewayEvent, context: Context) => {
  return api.run(event, context);
};
