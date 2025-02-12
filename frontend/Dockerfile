FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better cache utilization
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN yarn build

# Production image
FROM node:18-alpine
WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["sh", "-c", "yarn build && yarn start"]