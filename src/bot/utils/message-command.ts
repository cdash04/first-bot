export function messageHasCommand(message: string, command: string): boolean {
  return message
    .trim()
    .split(' ')
    .some((word: string) => word === `!${command}`);
}
