# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# --- THIS IS THE CHANGE ---
# Install system dependencies. Add openssh-client for SSH functionality.
RUN apk add --no-cache python3 make g++ openssh-client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# The 'command' in docker-compose.yml will override this, but it's good practice
CMD ["npm", "run", "dev"]