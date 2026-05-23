// ecosystem.config.js
// PM2 configuration for production deployment

module.exports = {
  apps: [
    {
      name: "visualgv",
      script: "npm",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
      error_file: "/home/deploy/.pm2/logs/visualgv-error.log",
      out_file: "/home/deploy/.pm2/logs/visualgv-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      max_memory_restart: "1G",
      watch: false,
    },
  ],
};
