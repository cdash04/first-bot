import AWS from 'aws-sdk';
import { ChatUserstate } from 'tmi.js';
import { messageHasCommand } from '../utils/message-command';

const sns = new AWS.SNS({
  endpoint: 'http://127.0.0.1:4002',
  region: 'us-east-1',
});

enum Command {
  First = 'first',
}

export const messageHandler = (
  target: string,
  tags: ChatUserstate,
  message: string,
  self: boolean,
) => {
  if (messageHasCommand(message, Command.First)) {
    sns.publish(
      {
        Message: JSON.stringify({
          broadcaster: target,
          viewer: tags.username,
          default: 'default',
        }),
        MessageStructure: 'json',
        TopicArn: 'arn:aws:sns:ca-central-1:123456789012:FirstTopic',
      },
      () => {
        console.log('ping');
      },
    );
  }
};
