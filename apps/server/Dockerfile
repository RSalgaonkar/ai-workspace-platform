FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
WORKDIR /app/apps/server
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=build /app/apps/server/prisma ./apps/server/prisma
COPY --from=build /app/apps/server/package.json ./apps/server/package.json
WORKDIR /app/apps/server
EXPOSE 5000
CMD ["node", "dist/server.js"]
