module.exports = {
  apps: [
    {
      name: "admin",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
