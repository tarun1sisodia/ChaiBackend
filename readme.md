# ChaiBackend

## What is this repo?
ChaiBackend is a Node.js + Express backend service built to provide API endpoints, data persistence (MongoDB Atlas), and media handling (Cloudinary). It is a minimal but extensible backend suitable for demos, prototypes, and learning projects.

## Why do we need this repo?
This backend centralizes server-side logic:
- Persistent data storage and querying (MongoDB Atlas)
- Authentication and user management (addable)
- File/media handling via Cloudinary
- A stable API surface for frontends and clients
It provides a reproducible starting point for development, testing, and deployment.

## Who is this for?
- Students and developers learning Node.js, Express, and MongoDB.
- Small teams building a prototype that needs cloud DB and image hosting.
- Contributors who want to extend functionality (auth, payments, tests, CI/CD).

## How this repo was created (without AI)
All code in this project was written and organized manually:
- Project scaffold created by developer(s).
- Routes, controllers, and models authored by hand.
- Environment config and dependency management created manually.
- Cloud services (MongoDB Atlas, Cloudinary) integrated using their official SDKs.

## What the repo contains
- src/
  - index.js — app bootstrap and DB connection orchestration
  - app.js — Express app, middleware, routes registration
  - db/ — DB connection helper (connectDB)
  - models/ — Mongoose schemas and models
  - controllers/ — request handlers and business logic
  - routes/ — API route definitions
  - middlewares/ — custom middlewares
- public/ — static assets
- .env.example — environment variables template
- package.json — scripts & dependencies
- tests/ — test suites (unit/integration) (added in latest updates)

## Tech stack, tools & frameworks
- Node.js
- Express
- MongoDB Atlas (hosted MongoDB)
- Mongoose (ODM)
- Cloudinary (media hosting)
- dotenv (env var management)
- multer (for file uploads — recommended)
- jest / supertest (testing) or other testing frameworks
- nodemon (dev auto-reload)
- Prettier / ESLint (optional code quality)

## Environment variables (example)
Copy `.env.example` to `.env` and set:
- MONGO_URI or MONGODB_URI: mongodb+srv://<user>:<password>@.../<dbname>?retryWrites=true&w=majority
- PORT (optional, default 8000)
- CORS_ORIGIN (frontend origin)
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- Any other keys used by services

## How to run locally
1. Clone repo:
   git clone https://github.com/tarun1sisodia/ChaiBackend.git
2. Install:
   npm install
3. Configure `.env` as above.
4. Dev start:
   npm run dev
   or
   node src/index.js

## Running tests
- Ensure tests use separate test DB or in-memory DB (mongodb-memory-server).
- Run:
  npm test
- If your tests expect CLOUDINARY env variables, either provide test credentials or mock Cloudinary.

## Debugging MongoDB Atlas common issues
- Confirm env var name in .env matches what the code reads (MONGO_URI vs MONGODB_URI).
- Ensure .env is loaded before DB connection (dotenv.config()).
- Make sure Atlas network access includes your server IP (or add temporary 0.0.0.0/0).
- Verify DB user credentials and DB name.
- Use connect-test.js to verify connect + write capability.
- Enable mongoose.set('debug', true) to see queries.

## Cloudinary integration
- Use Cloudinary SDK (v2) and configure via env vars.
- Prefer direct client uploads when possible (unsigned uploads) to reduce server load.
- Use multer for server-side uploads and forward file to Cloudinary.

## Project structure & how to contribute
- Fork the repo.
- Create a feature branch: git checkout -b feat/your-feature
- Write code, add tests.
- Run lint & tests locally.
- Open a PR describing changes and link issues as needed.

Suggested branching model:
- main (stable)
- develop (integration)
- feature/* (work in progress)

## Future upgrades
- Add authentication (JWT + refresh).
- Add role-based access control.
- Add full test coverage (unit + integration) and CI pipeline (GitHub Actions).
- Add Docker and docker-compose for local development.
- Add logging & monitoring (winston, Sentry).
- Improve rate-limiting, validation (Joi), and sanitization.

## License & Contact
- Add your preferred license (MIT / Apache-2.0 / etc.)
- For issues or support: open an issue on the repository.

