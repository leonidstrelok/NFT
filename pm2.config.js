module.exports = {
  apps: [
    {
      name: 'goldor.pro',
      script: 'node_modules/next/dist/bin/next',
      args: 'start --port 3001',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '250M',
    },
  ],
};
