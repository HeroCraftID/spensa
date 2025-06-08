// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "admin",
      cwd: "./admin",
      script: "npm",
      args: "start",
    },
    {
      name: "client",
      cwd: "./Client",
      script: "npm",
      args: "start",
    },
  ],
};
