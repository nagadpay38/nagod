module.exports = {
    apps: [
      {
        name: "server",
        script: "index.js",
        watch: true, // Restart if file changes
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  