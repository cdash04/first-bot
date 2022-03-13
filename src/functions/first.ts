import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';

import {
  getBroadcasterRepository,
  getViewerReposiroty,
} from '../repository/dynamo-repository';

import { corsMiddleware } from '../middlewares/cors';

const api = createAPI({});

api.post('/firsts', async (req: Request, res: Response) => {
  console.log({ body: req.body });
  const { broadcaster: broadcasterName, viewer: viewerName } = req.body;

  // broadcaster and viewer are the same person
  if (broadcasterName === viewerName) {
    return res.status(200).json({
      message: `Really @${broadcasterName}? Did you try to first yourself? That's sad bro.`,
    });
  }

  const broadcasterRepository = await getBroadcasterRepository();

  const broadcaster = await broadcasterRepository
    .find({
      name: broadcasterName,
    })
    .then((broadcaster) => {
      if (!broadcaster.count) {
        return broadcasterRepository.create({
          name: broadcasterName,
        });
      }
      return broadcaster[0];
    });

  const viewerReposiroty = await getViewerReposiroty();

  const viewer = await viewerReposiroty
    .get({
      name: viewerName,
      broadcasterName,
    })
    .then((viewer) => {
      if (!viewer) {
        return viewerReposiroty.create({
          name: viewerName,
        });
      }
      return viewer;
    });

  console.log({ broadcaster, viewer });

  return res.status(200).json({ broadcaster, viewer });
});

api.get('/firsts/:broadcaster/:viewer', async (req: Request, res: Response) => {
  return { status: 'ok' };
});

api.use(corsMiddleware);

export const handler = async (event: APIGatewayEvent, context: Context) => {
  return api.run(event, context);
};
