module.exports = {
  apps: [
    {
      name: "booklatch-api",
      script: "dist/src/main.js",
      cwd: "/home/ubuntu/t-booklatch",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};