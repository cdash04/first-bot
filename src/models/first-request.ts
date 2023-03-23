import { Request } from 'lambda-api';

interface FirstRequestBody {
  broadcasterId: string;
  broadcasterName: string;
  viewerId: string;
  viewerName: string;
}

export interface FirstRequest extends Request {
  body: FirstRequestBody;
}
