# 🚀 Boilerplate Clean Architecture avec Node.js & TypeScript

![GitHub license](https://img.shields.io/github/license/Emmanuel-Ghomsi/boilerplate-node)
![GitHub stars](https://img.shields.io/github/stars/Emmanuel-Ghomsi/boilerplate-node?style=social)
![GitHub forks](https://img.shields.io/github/forks/Emmanuel-Ghomsi/boilerplate-node?style=social)
![GitHub issues](https://img.shields.io/github/issues/Emmanuel-Ghomsi/boilerplate-node)
![Build Status](https://img.shields.io/github/actions/workflow/status/Emmanuel-Ghomsi/boilerplate-node/ci-cd.yml)
![Docker Support](https://img.shields.io/badge/docker-supported-blue)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)
![Fastify](https://img.shields.io/badge/Fastify-%F0%9F%9A%80-green)
![TypeScript](https://img.shields.io/badge/TypeScript-%F0%9F%92%BB-blue)

Un **boilerplate avancé** basé sur **Node.js**, **TypeScript** et la **Clean Architecture**, conçu pour offrir un socle robuste, évolutif et modulaire pour le développement d’APIs modernes.

---

## 📌 **Pourquoi ce Boilerplate ?**  
🔥 **Gagnez du temps** : Un projet prêt à l'emploi avec **une architecture propre** et **les bonnes pratiques**  
⚡ **Performance** : Basé sur **Fastify**, plus rapide qu’Express 🚀  
🔒 **Sécurité & Authentification** : JWT, validation, rate limiting, gestion avancée des erreurs  
💡 **Scalabilité** : Compatible avec **Docker, Kubernetes et CI/CD**  
📜 **Code bien structuré** : Suivi des **principes SOLID et Clean Code**  

---

## 📌 **Caractéristiques**
- ✅ **Architecture Clean** (Domain, Application, Infrastructure, Interface)
- ✅ **Framework rapide & minimaliste** : [Fastify](https://www.fastify.io/)
- ✅ **ORM puissant** : [Prisma](https://www.prisma.io/)
- ✅ **Authentification JWT sécurisée**
- ✅ **Middleware de validation & gestion d'erreurs**
- ✅ **Logger avancé avec Pino**
- ✅ **Cache performant avec Redis**
- ✅ **Tests avancés avec Jest & Supertest**
- ✅ **Scalabilité : Docker, Kubernetes, CI/CD GitHub Actions**

---

## 📂 **Structure du projet**
```yaml
📦 src
┣ 📂 core # Configurations globales & exceptions
┣ 📂 domain # Entités métier & interfaces
┣ 📂 application # Services métier
┣ 📂 infrastructure # Repositories, cache & persistance
┣ 📂 interface/http # Routes, middlewares & contrôleurs
┣ 📂 tests # Tests unitaires & d'intégration
┣ 📂 config # Configuration (logger, cache, DB)
┣ 📜 server.ts # Point d'entrée de l'API
```

---

## 🚀 **Installation & Démarrage**

### **1️⃣ Prérequis**
- [Node.js](https://nodejs.org/) `v20+`
- [Docker](https://www.docker.com/) *(optionnel, recommandé pour la production)*
- PostgreSQL (ou Redis si utilisé en cache)

### **2️⃣ Cloner le projet**
```bash
git clone https://github.com/Emmanuel-Ghomsi/boilerplate-node.git
cd boilerplate-node
```

### **3️⃣ Installer les dépendances**
```bash
npm install
```

### **4️⃣ Configurer les variables d’environnement**
```ini
DATABASE_URL=postgresql://user:password@localhost:5432/boilerplate_db
JWT_SECRET=mysecretkey
```

### **5️⃣ Démarrer le serveur**
```bash
npm run dev
```

L’API est accessible sur :
📌 http://localhost:3000

---

## **🧪 Tests**

### **1️⃣ Lancer les tests unitaires & d'intégration**
```bash
npm test
```

### **2️⃣ Vérifier la couverture de code**
```bash
npm run test:coverage
```

---

## **🐳 Docker**

Démarrer l'API avec Docker Compose
```bash
docker-compose up --build
```
📌 L'API sera accessible sur http://localhost:3000

---

## **🚀 Déploiement & CI/CD**

### **1️⃣ CI/CD avec GitHub Actions**
Le projet inclut une pipeline CI/CD pour :
- ✅ Exécuter les tests Jest
- ✅ Vérifier le linting
- ✅ Construire et déployer l’image Docker

### **2️⃣ Déploiement avec Kubernetes**
```bash
kubectl apply -f k8s-deployment.yml
```

📌 Le projet peut être scalé automatiquement sur un cluster Kubernetes.

---

## **📜 API Documentation**
L’API est documentée avec Swagger.

📌 Accède à la documentation interactive :
http://localhost:3000/docs

---

## **🤝 Contribuer**
Les contributions sont les bienvenues ! Suivez ces étapes :
1. Fork le projet 🍴
2. Crée une branche (git checkout -b feature-nouvelle-fonction)
3. Fais tes modifications & commit (git commit -m "Ajout de X")
4. Pousse les changements (git push origin feature-nouvelle-fonction)
5. Ouvre une Pull Request 📩

---

## **📝 Licence**
Ce projet est sous licence MIT. 📜

💡 Inspiré par les bonnes pratiques de Clean Architecture & Hexagonal Architecture.
