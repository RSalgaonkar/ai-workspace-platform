# AI Workspace Platform

A modern collaborative SaaS portfolio project with authentication, multi-workspace collaboration, realtime chat, invitations, permissions, analytics, search, AI-assistant foundations, and production deployment scaffolding.

## Local Development

```bash
npm install
npm run dev
```

The frontend runs from `apps/client` and the Express API runs from `apps/server`.

## Vercel Deployment

This repository is configured for Vercel to deploy the Next.js client only. In Vercel, set the project Root Directory to:

```text
apps/client
```

Vercel uses:

```bash
npm install
npm run build
```

The client `vercel.json` keeps the Vercel build focused on the Next app. A root `vercel.json` is also included for root-level monorepo builds and uses `npm run build --workspace apps/client`.

### Vercel Environment Variables

Set these in your Vercel project:

```env
NEXT_PUBLIC_API_URL=https://your-api-host.example.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-api-host.example.com
```

Do not use `localhost` values in Vercel. The API should be deployed separately on a Node-friendly host such as Railway, Render, Fly.io, or a VPS.

### API Host Environment Variables

Set these wherever the Express server is deployed:

```env
DATABASE_URL=postgresql://user:password@host:5432/ai_workspace
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=https://your-vercel-app.vercel.app
NODE_ENV=production
PORT=5000
```

For multiple frontend origins, separate them with commas:

```env
CLIENT_ORIGIN=http://localhost:3000,https://your-vercel-app.vercel.app
```

Production auth cookies are configured with `secure: true` and `sameSite: "none"` so refresh-token cookies can work across the Vercel frontend and hosted API over HTTPS.

## Useful Commands

```bash
npm run lint --workspace apps/client
npm run build --workspace apps/client
npm run build --workspace apps/server
```
