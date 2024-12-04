#!/bin/bash

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Error: Vercel CLI is not installed. Install it using 'npm install -g vercel'."
    exit 1
fi

# Check if an environment option is provided
if [ -z "$1" ]; then
    echo "Usage: $0 --production | --preview | --development"
    exit 1
fi

# Determine the environment based on the argument
ENV=""
case "$1" in
    --production)
        ENV="production"
        ;;
    --preview)
        ENV="preview"
        ;;
    --development)
        ENV="development"
        ;;
    *)
        echo "Invalid option: $1"
        echo "Usage: $0 --production | --preview | --development"
        exit 1
        ;;
esac

# Fetch all environment variables for the current project
echo "Fetching environment variables for the '$ENV' environment..."
ENV_VARS=$(vercel env ls | awk 'NR > 2 {print $1}' | sed '/^$/d')

if [ -z "$ENV_VARS" ]; then
    echo "No environment variables found for the '$ENV' environment."
    exit 0
fi

# Loop through and remove each environment variable
echo "Removing all environment variables from the '$ENV' environment..."
for VAR in $ENV_VARS; do
    echo "Removing $VAR..."
    vercel env rm $VAR $ENV -y
done

echo "All environment variables have been removed successfully from the '$ENV' environment."