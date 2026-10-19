# AI Support Bot

Backend for an AI-powered customer support assistant. Users chat with a bot that
answers questions from the company's knowledge base and creates support tickets
when it can't help.

> 🚧 Work in progress — MVP is being built in 7 days.

## Status

- [x] Day 1 — Project setup: NestJS, PostgreSQL (Docker), Prisma, config, health check
- [ ] Day 2 — Auth (JWT), roles, tickets CRUD
- [ ] Day 3 — LLM chat with conversation history
- [ ] Day 4 — Tool calling: bot creates and checks tickets
- [ ] Day 5 — RAG: answers based on uploaded documents (pgvector)
- [ ] Day 6 — Tests, Swagger, Docker, deployment
- [ ] Day 7 — Demo

## Tech stack

- **NestJS** + **TypeScript**
- **PostgreSQL 17** (Docker) + **Prisma** ORM
- **Docker Compose** for local infrastructure
- Coming next: JWT auth, Anthropic API, pgvector, Jest, Swagger

## Getting started

### Prerequisites

- Node.js (LTS)
- Docker Desktop

### Run locally

```bash
# 1. Install dependencies
npm install

# 2. Create your env file and fill in the values
cp .env.example .env

# 3. Start PostgreSQL
docker compose up -d

# 4. Apply database migrations
npx prisma migrate dev

# 5. Start the app in watch mode
npm run start:dev
```

Check that everything works:

```bash
curl http://localhost:3000/health
# {"status":"ok","db":"ok", ...}
```

## Environment variables

| Variable | Description |
|---|---|
| `POSTGRES_USER` | Database user created on first container start |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DB` | Database name |
| `POSTGRES_PORT` | Host port for PostgreSQL (default `5432`) |
| `DATABASE_URL` | Prisma connection string |

## Project structure

```
src/
  prisma/          # PrismaService, global DB access
  health/          # GET /health — app + DB status
  auth/            # registration, login, JWT (day 2)
  users/           # user data access (day 2)
  tickets/         # support tickets (day 2)
  llm/             # the only place that talks to the LLM provider (day 3)
  tools/           # tools for the model + agent loop (day 4)
  knowledge/       # documents, embeddings, vector search (day 5)
  conversations/   # chat endpoints and message history (day 3)
```