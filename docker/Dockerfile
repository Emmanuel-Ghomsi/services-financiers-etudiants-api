# Étape 1 : build (avec Prisma + TypeScript)
FROM node:20-bullseye AS builder

WORKDIR /app

# Copie des fichiers nécessaires à l'installation
COPY package.json package-lock.json ./

# Installation des dépendances avec Prisma
RUN npm install --legacy-peer-deps

# Copie le fichier .env.example
COPY .env.example .env.example

# Copie du reste de l'application
COPY . .

# Génération du client Prisma
RUN npx prisma generate

# Compilation TypeScript + ajustement des alias
RUN npm run build

# Étape 2 : production runner allégé
FROM node:20-bullseye AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copie uniquement ce qui est nécessaire pour exécuter l'app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.example .env

# Créer dossier de logs
RUN mkdir -p /app/logs

# Exposition du port utilisé par Fastify
EXPOSE 2025

# Lancement de l'application sans tsconfig-paths (tsc-alias déjà passé)
CMD ["node", "dist/server.js"]
