# Étape 1 : build (avec Prisma + TypeScript)
FROM node:20-bullseye AS builder

WORKDIR /app

# Copie des fichiers nécessaires à l'installation
COPY package.json package-lock.json ./

# Installation des dépendances
RUN npm install --legacy-peer-deps

# Copie du reste de l'application
COPY . .

# Génération Prisma + build + remplacement des paths
RUN npx prisma generate
RUN npm run build

# Étape 2 : production runner allégé
FROM node:20-bullseye AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copie uniquement les fichiers nécessaires
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/resources ./src/resources
COPY --from=builder /app/.env.example .env

COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

# Créer dossier de logs
RUN mkdir -p /app/logs

# Exposition du port
EXPOSE 2025

# Lancement
CMD ["./entrypoint.sh"]
