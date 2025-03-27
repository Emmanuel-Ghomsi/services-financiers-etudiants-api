/* eslint-disable no-undef */

import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { config } from './env';

// Récupérer l'environnement actuel
const env = config.server.env;
const isDev = env === 'development';

// Définir le chemin du fichier log
const logDir = path.join(__dirname, '../../../logs');
const logFile = path.join(logDir, `api-${env}.log`);

// S'assurer que le dossier `logs` existe
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logger = pino(
  {
    level: config.server.log,
  },
  isDev
    ? pino.destination({ dest: logFile, sync: true })
    : pino.destination({ dest: logFile, sync: false })
);

export const loggerConfig = {
  level: config.server.log,
};
