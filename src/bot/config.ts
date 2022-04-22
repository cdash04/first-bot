import 'dotenv/config';

export default {
  apps: [
    {
      name: 'bot',
      script: 'bot/index.js',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
        BOT_NAME: process.env.BOT_NAME,
        TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
        TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
        TWITCH_TMI_OAUTH: process.env.TWITCH_TMI_OAUTH,
        TWITCH_EVENT_SUB_LISTENER_SECRET:
          process.env.TWITCH_EVENT_SUB_LISTENER_SECRET,
        APP_API_URL: process.env.APP_API_URL,
      },
    },
  ],
};
