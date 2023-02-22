# web-boilerplate
A standard, minimal boilerplate for web apps. This includes best practices that I've found work well, and let me work quickly. This documentation is a WIP, and will be updated over time.

## server
A Fastify-based web server. Includes,
- Full testing setup
- Containerization + local scripts
- Basic support for login/register (with tests)

### Setup
BEFORE DEVELOPMENT, do the following.
1. Open `.env`, and set `PROJECT_NAME` to something reasonable. This is important to play nice with other dockerized projects.
### Development
- All code goes in `src`, with routes split across `routes`.
- To run a live-reloading dev server, run `npm run dev`
- To start the development DB, run `docker compose up db`
- To start a containerized server (and DB) run `docker compose up server`