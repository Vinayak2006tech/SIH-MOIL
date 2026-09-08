FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm install

# Copy source code and build TypeScript to dist
COPY . .
RUN npm run build

# Default environment
ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["npm", "start"]
