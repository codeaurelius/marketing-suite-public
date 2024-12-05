#!/bin/bash

# Usage message
usage() {
  echo "Usage: $0 --app [app|api|web] [--production|--preview]"
  exit 1
}

# Parse arguments
APP=""
ENVIRONMENT=""

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --app)
      APP="$2"
      shift 2
      ;;
    --production)
      ENVIRONMENT="production"
      shift
      ;;
    --preview)
      ENVIRONMENT="preview"
      shift
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

# Validate arguments
if [[ -z "$APP" || -z "$ENVIRONMENT" ]]; then
  echo "Error: Missing required arguments."
  usage
fi

# Validate the app directory
APP_DIR="./apps/$APP"
if [[ ! -d "$APP_DIR" ]]; then
  echo "Error: App directory '$APP_DIR' does not exist."
  exit 1
fi

# Navigate to the app directory
cd "$APP_DIR" || { echo "Error: Failed to navigate to $APP_DIR"; exit 1; }

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Error: Vercel CLI is not installed. Please install it first."
  exit 1
fi

# Function to remove all environment variables
remove_env_vars() {
  local env=$1

  # List all environment variables for the specified environment
  echo "Listing environment variables for '$env' environment in app '$APP'..."
  env_vars=$(vercel env ls | awk 'NR > 2 {print $1}' | sed '/^$/d')

  if [[ -z "$env_vars" ]]; then
    echo "No environment variables found for '$env' environment."
    return
  fi

  # Iterate over and remove each environment variable
  for var in $env_vars; do
    echo "Removing environment variable '$var' for '$env' environment..."
    vercel env rm "$var" "$env" -y
  done

  echo "All environment variables removed for '$env' environment in app '$APP'."
}

# Remove environment variables based on the selected environment
remove_env_vars "$ENVIRONMENT"