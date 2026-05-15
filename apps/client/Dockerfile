FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY apps/client/package*.json ./apps/client/
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
WORKDIR /app/apps/client
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app/apps/client
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/apps/client/.next ./.next
COPY --from=build /app/apps/client/public ./public
COPY --from=build /app/apps/client/package.json ./package.json
EXPOSE 3000
CMD ["npm", "run", "start"]
