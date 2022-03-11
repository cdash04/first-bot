import { Request, Response, NextFunction } from 'lambda-api';

const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';

export const challengeWebhookMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
    const { challenge } = req.body;
    res.status(200).send(challenge);
  }
  next();
};
