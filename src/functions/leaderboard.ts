import { Context, APIGatewayEvent } from 'aws-lambda';

const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log({ event }); // log the event
};

export default handler;
