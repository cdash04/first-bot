import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import Dynamo from 'dynamodb-onetable/Dynamo';
import { Model, Table } from 'dynamodb-onetable';

import { Schema } from './schema';

const params = {};

const client = new Dynamo({ client: new DynamoDBClient(params) });
const table = new Table({
  client,
  name: 'MyTable',
  schema: Schema,
});
