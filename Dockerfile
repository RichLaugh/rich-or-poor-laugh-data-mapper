# Use a lightweight Node.js image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json .

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Expose the port the application runs on
EXPOSE 5173

RUN npm run build
# Command to run the application
CMD ["npm", "run", "preview", "--port", "5173"]
