/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from 'lambda-api';
import crypto from 'crypto';

const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP =
  'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE =
  'Twitch-Eventsub-Message-Signature'.toLowerCase();

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = 'sha256=';

function getHmacMessage(req: Request) {
  return `${req.headers[TWITCH_MESSAGE_ID]}${
    req.headers[TWITCH_MESSAGE_TIMESTAMP]
  }${JSON.stringify(req.body)}`;
}

// Get the HMAC.
function getHmac(secret: string, message: string) {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

// Verify whether your signature matches Twitch's signature.
function verifyMessage(hmac: string, verifySignature: string) {
  return crypto.timingSafeEqual(
    Buffer.from(hmac),
    Buffer.from(verifySignature),
  );
}

export const eventSubSecret = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const secret = process.env.TWITCH_EVENT_SUB_LISTENER_SECRET;
  const message = getHmacMessage(req);
  const hmac = `${HMAC_PREFIX}${getHmac(secret, message)}`;
  if (!verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
    return res.status(403);
  }
  next();
};
