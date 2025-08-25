# Super-Base: Superhero Database

A full-stack application for managing superhero data with images.

<img width="3024" height="1716" alt="image" src="https://github.com/user-attachments/assets/df566bde-641c-442f-84e0-0af1914e7a55" />

<img width="3024" height="1712" alt="image" src="https://github.com/user-attachments/assets/b8d4fe48-5f87-48ad-ae20-783e46456a3a" />

## Development Setup

### 1. Database Setup

Start the PostgreSQL database using Docker:

```bash
docker-compose up -d
```

This will start a PostgreSQL instance on port 5432.

### 2. Backend Setup

```bash
# Navigate to backend package
cd packages/backend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run migrations and seed data
pnpm run migrate:push
pnpm run seed

# Start the development server
pnpm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend package
cd packages/frontend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Start the development server
pnpm run dev
```

## Project Structure
- `backend`: Express API with PostgreSQL database
- `frontend`: React application
- `shared`: Common types and utilities
