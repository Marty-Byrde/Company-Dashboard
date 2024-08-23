# First Stage: Build the Application
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the package.json, package-lock.json, and .env file
COPY package*.json ./
COPY yarn.lock ./
COPY .env ./

# Install dependencies
RUN yarn cache clean
RUN yarn --update-checksums
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Second Stage: Run the Application
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary build artifacts from the builder stage
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "production"]
