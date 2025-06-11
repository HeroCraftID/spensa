// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "admin",
      cwd: "./admin",
      script: "npm",
      args: "start",
      env: {
        PORT: 3000,
      }
    },
    {
      name: "client",
      cwd: "./Client",
      script: "npm",
      args: "start",
      env: {
        PORT: 3001,
      }
    },
  ],
};
