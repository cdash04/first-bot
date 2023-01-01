import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import Dynamo from 'dynamodb-onetable/Dynamo';
import { Table } from 'dynamodb-onetable';

import { Broadcaster, Schema, Viewer } from './schema';

const params: DynamoDBClientConfig = {};
const client = new Dynamo({ client: new DynamoDBClient(params) });

const table = new Table({
  client,
  name: process.env.TABLE_NAME,
  schema: Schema,
  logger: true,
});

export const viewerRepository = table.getModel<Viewer>('Viewer');

export const broadcasterRepository = table.getModel<Broadcaster>('Broadcaster');
