export function messageHasCommand(message: string, command: string): boolean {
  return message
    .trim()
    .toLowerCase()
    .split(' ')
    .some((word: string) => word === `!${command.toLowerCase()}`);
}
