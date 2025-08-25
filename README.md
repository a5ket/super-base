# Super-Base: Superhero Database

A full-stack application for managing superhero data with images.

## Quick Start

### Development Setup

1. Start the PostgreSQL database:
   ```bash
   docker-compose up -d
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   # Copy example env files
   cp packages/backend/.env.example packages/backend/.env
   cp packages/frontend/.env.example packages/frontend/.env
   ```

4. Run database migrations and seed data:
   ```bash
   pnpm --filter backend migrate:push
   pnpm --filter backend seed
   ```

5. Start backend and frontend in development mode:
   ```bash
   # In one terminal
   pnpm --filter backend dev
   
   # In another terminal
   pnpm --filter frontend dev
   ```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Project Structure
- `backend`: Express API with PostgreSQL database
- `frontend`: React application
- `shared`: Common types and utilities
