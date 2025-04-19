#!/bin/bash

# Make the script executable
chmod +x run-dev.sh

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the development server
echo "Starting development server..."
npm run dev
