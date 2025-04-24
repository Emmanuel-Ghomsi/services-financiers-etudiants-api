/* eslint-disable no-undef */

import dotenv from 'dotenv';

// Charger les variables 'environnement
dotenv.config();

export const config = {
  postgres: {
    uri: process.env.DATABASE_URL || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
  },
  regis: {
    host: process.env.REDIS_HOST || 'localhost',
  },
  server: {
    port: process.env.PORT || 9090,
    env: process.env.NODE_ENV || 'development',
    prefix: process.env.PREFIX || 'api/v1',
    log: process.env.LOG_LEVEL || 'info',
    host: process.env.HOST,
    frontend: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  mail: {
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || 'user',
    password: process.env.SMTP_PASS || 'password',
    admin:
      process.env.SUPER_ADMIN_EMAIL ||
      'super-admin@services-financiers-etudiants.com',
  },
};
