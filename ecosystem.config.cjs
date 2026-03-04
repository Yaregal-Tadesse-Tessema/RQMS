module.exports = {
  apps: [
    {
      name: "rqms-api",
      cwd: "./apps/api",
      script: "dist/main.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        API_PORT: "4000",
        DATABASE_URL: "postgres://postgres:change_me@127.0.0.1:5432/rqms",
        DATABASE_SSL: "false",
        TYPEORM_SYNCHRONIZE: "false",
        AUTH_JWKS_URL: "http://localhost:3000/api/auth/jwks",
        AUTH_BASE_URL: "http://localhost:3000"
      }
    }
  ]
};
