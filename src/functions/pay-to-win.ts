import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';

import { broadcasterRepository } from '../repository/dynamo-repository';

import { corsMiddleware } from '../middlewares/cors';

const api = createAPI({ logger: true });

api.use(corsMiddleware);

api.post('/pay-to-win', async (req: Request, res: Response) => {
  const { broadcasterId, broadcasterName, viewerName } = req.body;

  let broadcaster = await broadcasterRepository.get({ id: broadcasterId });

  // when command is not used by the broadcaster
  if (broadcasterName !== viewerName) {
    return res.status(200).json({
      message: `@${viewerName} pay to win is currently ${
        broadcaster.payToWinIsEnabled ? 'on' : 'off'
      }.`,
    });
  }

  // when streamer is new
  if (!broadcaster) {
    broadcaster = await broadcasterRepository.create({
      id: broadcasterId,
      name: broadcasterName,
      payToWinIsEnabled: true,
    });
  }

  // toggle pay to win status
  broadcaster = await broadcasterRepository.update(
    {
      id: broadcasterId,
    },
    {
      set: {
        payToWinIsEnabled: !broadcaster.payToWinIsEnabled,
      },
    },
  );

  return res.status(200).json({
    message: broadcaster.payToWinIsEnabled
      ? `@${broadcasterName} pay to win is now enabled`
      : `@${broadcasterName} pay to win is now disabled`,
  });
});

export const handler = async (event: APIGatewayEvent, context: Context) =>
  api.run(event, context);
