FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

COPY prisma ./prisma

FROM base AS deps
RUN npm ci

FROM deps AS builder
COPY . .
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy npx prisma generate
RUN npm run build


FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/src/server.js"]

FROM deps AS development
COPY . .
ENV NODE_ENV=development
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy npx prisma generate
EXPOSE 3000

CMD ["npm", "run", "dev:api"]
