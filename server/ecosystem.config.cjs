module.exports = {
    apps: [
      {
        name: "server",
        script: "index.js", // Replace with your server entry point
        watch: true, // Enable watch mode
        ignore_watch: ["public/images", "node_modules"], // Ignore specific directories
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  