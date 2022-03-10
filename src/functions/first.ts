import { SNSEvent, Context } from 'aws-lambda';

export const handler = async (event: SNSEvent, context: Context) => {
  console.log({ event, context }); // log the event
};
