FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm install

FROM deps AS builder
COPY . .
RUN npm run build --workspace frontend

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/frontend ./frontend
WORKDIR /app/frontend
EXPOSE 3000
CMD ["npm", "run", "start"]

