export const buildCacheKey = (moduleName: string, args: Array<string>) => {
  return moduleName + ':' + args.join(':');
};
