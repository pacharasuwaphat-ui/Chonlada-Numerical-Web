# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV MONGO_URI=mongodb://Chonlada:ChonladaPachara@ac-bxnh5dj-shard-00-00.t1zxkpe.mongodb.net:27017,ac-bxnh5dj-shard-00-01.t1zxkpe.mongodb.net:27017,ac-bxnh5dj-shard-00-02.t1zxkpe.mongodb.net:27017/Numer?ssl=true&replicaSet=atlas-3ktams-shard-0&authSource=admin
ENV CORS_ORIGIN=https://chonlada-numerical-web.onrender.com/
ENV FRONTEND_URL=https://chonlada-numerical-web.onrender.com/

RUN npm run build

# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/main.js"]
