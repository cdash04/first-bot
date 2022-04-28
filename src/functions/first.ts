import { APIGatewayEvent, Context } from 'aws-lambda';
import createAPI, { Request, Response } from 'lambda-api';

import {
  broadcasterRepository,
  viewerRepository,
} from '../repository/dynamo-repository';

import { corsMiddleware } from '../middlewares/cors';

const api = createAPI({ logger: true });

api.use(corsMiddleware);

api.post('/firsts', async (req: Request, res: Response) => {
  console.log({ body: req.body });
  const { broadcaster: broadcasterName, viewer: viewerName } = req.body;

  // broadcaster and viewer are the same person
  if (broadcasterName === viewerName) {
    return res.status(200).json({
      message: `Really @${broadcasterName}? Did you try to first yourself? That's sad bro.`,
    });
  }

  // get broadcaster
  let broadcaster = await broadcasterRepository.get({ name: broadcasterName });

  console.log({ broadcaster });

  // if streamer is offline
  if (!broadcaster.online) {
    return res.status(201).json({
      message: `@${broadcaster.name} is offline, you cannot first someone who's offline`,
    });
  }

  // get viewer
  let viewer = await viewerRepository.get({
    name: viewerName,
    broadcasterName,
  });

  // when broadcaster is new, viewer is first and must be new
  if (!broadcaster) {
    [broadcaster, viewer] = await Promise.all([
      // create new broadcaster
      await broadcasterRepository.create({
        name: broadcasterName,
        currentFirstViewer: viewerName,
        currentFirstStreak: 1,
        firstIsRedeemed: true,
      }),
      // create new viewer
      await viewerRepository.create({
        name: viewerName,
        broadcasterName,
        firstCount: 1,
      }),
    ]);
    return res.status(200).json({
      message: `Congrats @${viewerName}, you are the first ever to this channel. Starting a whole new adventure.`,
    });
  }

  // when viewer is new but not broadcaster and first is not redeemed
  if (!viewer && !broadcaster.firstIsRedeemed) {
    [broadcaster, viewer] = await Promise.all([
      // update current streak viewer and current streak count
      await broadcasterRepository.update(
        { name: broadcasterName },
        {
          set: {
            currentFirstViewer: viewerName,
            currentFirstStreak: 1,
            firstIsRedeemed: true,
          },
        },
      ),
      // create new viewer
      await viewerRepository.create({
        name: viewerName,
        broadcasterName,
        firstCount: 1,
      }),
    ]);

    return res.status(200).json({
      message: `Congrats @${viewer.name}, it is your first first. Starting a new streak.`,
    });
  }

  // when viewer is new but the first is already redeemed
  if (!viewer && broadcaster.firstIsRedeemed) {
    const viewer = await viewerRepository.create({
      name: viewerName,
      broadcasterName,
      firstCount: 0,
    });

    return res.status(200).json({
      message: `Sorry @${viewer.name}, too late bro, @${broadcaster.currentFirstViewer} has already redeemed the first. Next time, git gud!`,
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
      message: `Sorry @${viewerName}, too late bro, @${broadcaster.currentFirstViewer} has already redeemed the first. Next time, git gud!`,
    });
  }

  // when !first has been redeemed by a new person
  if (broadcaster.currentFirstViewer !== viewer.name) {
    [broadcaster, viewer] = await Promise.all([
      // init streak
      broadcasterRepository.update(
        { name: broadcaster.name },
        {
          set: {
            currentFirstViewer: viewerName,
            currentFirstStreak: 1,
            firstIsRedeemed: true,
          },
        },
      ),
      // add 1 to viewer count
      viewerRepository.update(
        {
          name: viewer.name,
          broadcasterName: viewer.broadcasterName,
        },
        { add: { firstCount: 1 } },
      ),
    ]);

    return res.status(200).json({
      message: `Congrats @${viewer.name}, you are the first, You've been first ${viewer.firstCount} time(s) in total. Starting a new streak.`,
    });
  }

  // when !first has been redeemed by the same person
  if (broadcaster.currentFirstViewer === viewer.name) {
    [broadcaster, viewer] = await Promise.all([
      // add 1 to the streak, since it continue and set firstIsRedeemed to true
      broadcasterRepository.update(
        { name: broadcaster.name },
        { add: { currentFirstStreak: 1 }, set: { firstIsRedeemed: true } },
      ),
      // add 1 to viewer count
      viewerRepository.update(
        {
          name: viewer.name,
          broadcasterName: viewer.broadcasterName,
        },
        { add: { firstCount: 1 } },
      ),
    ]);

    return res.status(200).json({
      message: `Congrats @${viewer.name}, you are the first, You've been first ${viewer.firstCount} time(s) in total. Currently on a streak of ${broadcaster.currentFirstStreak} first(s).`,
    });
  }

  return res.status(400).json({ errorMessage: 'first message was unhandled' });
});

api.get('/firsts/:broadcaster/:viewer', async (req: Request, res: Response) => {
  const { broadcaster: broadcasterName, viewer: viewerName } = req.params;

  // when viewer is the broadcaster
  if (broadcasterName === viewerName) {
    return res.status(200).json({
      message: `@${broadcasterName}, you cannot first yourself. Therefore, you are dead last`,
    });
  }

  let viewer = await viewerRepository.get({
    name: viewerName,
    broadcasterName,
  });

  if (!viewer) {
    viewer = await viewerRepository.create({
      broadcasterName,
      name: viewerName,
      firstCount: 0,
    });
  }

  return res.status(200).json({
    message: `@${viewer.name}, you currently have ${viewer.firstCount} first(s)`,
  });
});

export const handler = async (event: APIGatewayEvent, context: Context) =>
  api.run(event, context);
