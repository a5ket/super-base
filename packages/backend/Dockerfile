FROM node:22-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace configuration first
COPY pnpm-workspace.yaml ./
COPY package.json ./

# Copy package.json files for all workspaces
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared/package.json ./packages/shared/

# Copy TypeScript configs
COPY packages/backend/tsconfig.json ./packages/backend/
COPY packages/shared/tsconfig.json ./packages/shared/

# Install dependencies
RUN pnpm install

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend

# Build shared package first
WORKDIR /app/packages/shared
RUN pnpm build

# Switch to backend and build
WORKDIR /app/packages/backend
RUN pnpm build

# Verify the build output
RUN ls -la dist || echo "dist directory not created"

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["pnpm", "start"]