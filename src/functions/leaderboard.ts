import { Context, SNSEvent } from 'aws-lambda';

const handler = async (event: SNSEvent, context: Context) => {
  console.log({ event }); // log the event
};

export default handler;
