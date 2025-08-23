# Stage 1: Build the Nuxt App
FROM node:23-alpine as build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Nuxt app
RUN npm run generate

# Stage 2: Run the Nuxt App in Preview Mode
FROM node:23-alpine as preview-stage

# Set working directory
WORKDIR /app

# Copy the built Nuxt app from the build stage
COPY --from=build-stage /app/.output /app/.output

# Install only production dependencies (if needed)
COPY package*.json ./
RUN npm install --production

# Expose the port that Nuxt serves on (default is 3000)
EXPOSE 3000

# Start Nuxt in Preview Mode
CMD ["npm","run","preview"]
