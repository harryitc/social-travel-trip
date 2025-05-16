import { registerAs } from '@nestjs/config';

// Get assets path from env then provide this config to assets provider
export const ASSETS_PROVIDERS = registerAs('assetsProvider', () => ({
  app: process.env.ASSETS_PATH,
}));
