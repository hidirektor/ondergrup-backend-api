# Use the latest version of Node.js
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first to leverage Docker cache for dependencies
COPY rest-api/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY rest-api .

# Expose the application port
EXPOSE 3000

# Use an array for CMD to ensure proper signal handling
CMD ["npm", "start"]