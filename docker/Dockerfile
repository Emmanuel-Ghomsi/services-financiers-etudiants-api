# Étape 1 : build
FROM node:23-slim AS builder

WORKDIR /app

# Installer uniquement les dépendances nécessaires à la build
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build

# Étape 2 : production
FROM node:23-slim AS runner

WORKDIR /app

# Copie uniquement les fichiers nécessaires au run
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/src ./src

ENV NODE_ENV=production

EXPOSE 2025

CMD ["node", "dist/server.js"]

