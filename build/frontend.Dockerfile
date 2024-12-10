# Use Node.js Alpine image for the frontend
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the frontend source code into the container
COPY . /app/

# Command to run the Vite development server
CMD ["npm", "run", "dev"]
