import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';

import {
  broadcasterRepository,
  viewerRepository,
} from '../repository/dynamo-repository';

import { corsMiddleware } from '../middlewares/cors';

const api = createAPI({ logger: true });

api.use(corsMiddleware);

api.post('/pay-to-win', async (req: Request, res: Response) => {
  const { broadcaster: broadcasterName, viewer: viewerName } = req.body;

  // when command is not used by the broadcaster
  if (broadcasterName !== viewerName) {
    return res.status(200).json({
      message: `@${viewerName} only the streamer can perform this command`,
    });
  }

  let broadcaster = await broadcasterRepository.get({ name: broadcasterName });

  // when streamer is new
  if (!broadcaster) {
    broadcaster = await broadcasterRepository.create({
      name: broadcasterName,
      payToWinIsEnabled: true,
    });
  }

  broadcaster = await broadcasterRepository.update(
    {
      name: broadcasterName,
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
