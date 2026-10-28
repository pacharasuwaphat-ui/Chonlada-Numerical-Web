# ---------- Stage 1 ----------
FROM node:20-alpine AS builder

WORKDIR /app

# ENV NEXT_PUBLIC_API_URL=https://lucktichai-backend.onrender.com
ENV NEXT_PUBLIC_API_URL=http://172.17.48.1:4000
ENV HOST=localhost

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# ---------- Stage 2 ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]