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
      },
    },
  ],
};
