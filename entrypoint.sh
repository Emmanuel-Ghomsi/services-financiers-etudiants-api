#!/bin/sh

echo "✅ Lancement de l'entrypoint..."

# Vérifie que la base est accessible
echo "⏳ Vérification de la connexion à la base de données..."
until npx prisma db execute --schema=./prisma/schema.prisma --stdin < /dev/null > /dev/null 2>&1; do
  echo "🚫 La base de données n'est pas encore prête, nouvelle tentative dans 3s..."
  sleep 3
done

echo "✅ Base de données accessible."

# Migration de la base
echo "📦 Application des migrations Prisma..."
npx prisma migrate deploy

# Génération du client Prisma (au cas où)
echo "🛠️ Génération du client Prisma..."
npx prisma generate

# Démarrage de l'app
echo "🚀 Démarrage de l'application Node.js..."
node dist/server.js
