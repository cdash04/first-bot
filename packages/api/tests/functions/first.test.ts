import { handler } from 'api/lib/functions/first';

jest.mock('dynamodb-onetable');

describe('first', () => {
  it('should not have a null handler', () => {
    expect(handler).not.toBeNull();
  });
});
