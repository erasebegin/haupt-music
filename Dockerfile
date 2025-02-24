# Use official Bun image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY bun.lock package.json ./
RUN bun install

# Copy the rest of the application files
COPY . .

# Build the application (adjust command if necessary)
RUN bun run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]

