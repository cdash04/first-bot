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

export const handler = async (event: APIGatewayEvent, context: Context) => {
  return api.run(event, context);
};
