export const getKeyProfileValue = (...args: string[]): string => {
  return `git:profile:${args.join(':')}`;
};
