import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';

import {
  broadcasterRepository,
  viewerReposiroty,
} from '../repository/dynamo-repository';

import { corsMiddleware } from '../middlewares/cors';

const api = createAPI({ logger: true });

api.post('/firsts', async (req: Request, res: Response) => {
  console.log({ body: req.body });
  const { broadcaster: broadcasterName, viewer: viewerName } = req.body;

  // broadcaster and viewer are the same person
  if (broadcasterName === viewerName) {
    return res.status(200).json({
      message: `Really @${broadcasterName}? Did you try to first yourself? That's sad bro.`,
    });
  }

  // get broadcaster and viewer
  const broadcaster = await broadcasterRepository.get({
    name: broadcasterName,
  });
  const viewer = await viewerReposiroty.get({
    name: viewerName,
    broadcasterName,
  });

  // when broadcaster is new, viewer is first
  if (!broadcaster) {
    await broadcasterRepository.create({
      name: broadcasterName,
      currentFirstViewer: viewerName,
      currentFirstStreak: 1,
    });
    await viewerReposiroty.create({
      name: viewerName,
      broadcasterName,
    });
    return res.status(200).json({
      message: `Congratz @${viewerName}, you are the first ever to this channel. Starting a whole new adventure.`,
    });
  }

  // when viewer is new
  if (!viewer) {
    // create new viewer
    await viewerReposiroty.create({
      name: viewerName,
      broadcasterName,
    });

    // update current streak viewer and current streak count
    await broadcasterRepository.update(
      {
        name: broadcasterName,
      },
      { set: { currentFirstViewer: viewerName, currentFirstStreak: 1 } },
    );

    return res.status(200).json({
      message: `Congratz @${viewerName}, it is your first first. Starting a new streak.`,
    });
  }

  // when firstIsRedeemed and first is redemeed by the same person
  if (
    broadcaster.firstIsRedeemed &&
    broadcaster.currentFirstViewer === viewer.name
  ) {
    return res.status(200).json({
      message: `Geez @${viewerName}, you already got the first for this stream session, calm down you greedy`,
    });
  }

  // when firstIsRedeemed and first is redemeed by another person
  if (
    broadcaster.firstIsRedeemed &&
    broadcaster.currentFirstViewer !== viewer.name
  ) {
    return res.status(200).json({
      message: `Sorry @${viewerName}, too late broo, @${broadcaster.currentFirstViewer} has already redeemed the first. Next time, git gud!`,
    });
  }

  // when !first has been redeemed by a new person
  if (broadcaster.currentFirstViewer !== viewer.name) {
    // init streak
    await broadcasterRepository.update(
      { name: broadcaster.name },
      { set: { currentFirstViewer: viewerName, currentFirstStreak: 1 } },
    );

    // add 1 to viewer count
    await viewerReposiroty.update(
      {
        name: viewer.name,
        broadcasterName: viewer.broadcasterName,
      },
      { add: { firstCount: 1 } },
    );
    return res.status(200).json({
      message: `Congratz @${
        viewer.name
      }, you are the first, You've been first ${
        viewer.firstCount + 1
      } time(s) in total. Starting a new streak.`,
    });
  }

  // when !first has been redeemed by the same person
  if (broadcaster.currentFirstViewer === viewer.name) {

    // add 1 to the streak, since it continue
    await broadcasterRepository.update(
      { name: broadcaster.name },
      { add: { currentFirstStreak: 1 } },
    );

    // add 1 to viewer count
    await viewerReposiroty.update(
      {
        name: viewer.name,
        broadcasterName: viewer.broadcasterName,
      },
      { add: { firstCount: 1 } },
    );
  }

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
