import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import Dynamo from 'dynamodb-onetable/Dynamo';
import { Table } from 'dynamodb-onetable';

import { BroadcasterType, Schema, ViewerType } from './schema';

const params: DynamoDBClientConfig = {};
const client = new Dynamo({ client: new DynamoDBClient(params) });
const table = new Table({
  client,
  name: process.env.TABLE_NAME,
  schema: Schema,
});

console.log(process.env.TABLE_NAME);

table.createTable();

export const getViewerReposiroty = async () => {
  if (!(await table.exists())) {
    table.createTable();
  }
  return table.getModel<ViewerType>('Viewer');
};

export const getBroadcasterRepository = async () => {
  if (!(await table.exists())) {
    table.createTable();
  }
  return table.getModel<BroadcasterType>('Broadcaster');
};
