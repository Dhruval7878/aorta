# Use Node.js as base image
FROM node:20.15.1

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package.json ./
COPY package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all other project files to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "dev"]