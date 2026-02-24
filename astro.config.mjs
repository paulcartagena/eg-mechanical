// @ts-nocheck
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://egmechanic.com',
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind(), react(), sitemap()]
});