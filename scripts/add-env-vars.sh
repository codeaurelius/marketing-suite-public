#!/bin/bash

# Usage function
usage() {
    echo "Usage: $0 --app [app|api|web] -e <vercel-environment>"
    echo "  --app <app>             The app directory (app, api, web) under /apps"
    echo "  -e <vercel-environment> Target Vercel environment (preview, production, or development)"
    exit 1
}

# Parse flags
APP=""
ENVIRONMENT=""

while [[ "$#" -gt 0 ]]; do
    case "$1" in
        --app)
            APP="$2"
            shift 2
            ;;
        -e)
            ENVIRONMENT="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate app directory
if [[ -z "$APP" ]]; then
    echo "Error: Missing --app argument."
    usage
fi

APP_DIR="./apps/$APP"
if [[ ! -d "$APP_DIR" ]]; then
    echo "Error: App directory '$APP_DIR' does not exist."
    exit 1
fi

# Validate environment
if [[ -z "$ENVIRONMENT" || ! "$ENVIRONMENT" =~ ^(preview|production|development)$ ]]; then
    echo "Error: Invalid or missing Vercel environment. Must be 'preview', 'production', or 'development'."
    usage
fi

# Navigate to the app directory first
cd "$APP_DIR" || { echo "Error: Failed to navigate to $APP_DIR"; exit 1; }

# Determine input file based on environment (now relative to app directory)
if [[ "$ENVIRONMENT" == "production" ]]; then
    INPUT_FILE=".env.production"
elif [[ "$ENVIRONMENT" == "preview" ]]; then
    INPUT_FILE=".env.preview"
else
    echo "Error: Development environment is not supported for automatic env file selection."
    exit 1
fi

# Validate input file exists
if [[ ! -f "$INPUT_FILE" ]]; then
    echo "Error: Environment file '$INPUT_FILE' does not exist in $APP_DIR"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Error: Vercel CLI is not installed. Install it using 'npm install -g vercel'."
    exit 1
fi

# Process the input file and add variables to the specified Vercel environment
echo "Adding environment variables from '$INPUT_FILE' to the '$ENVIRONMENT' environment on Vercel..."
while IFS='=' read -r key value; do
    # Skip empty lines and comments
    if [[ -z "$key" || "$key" =~ ^# ]]; then
        continue
    fi

    # Strip surrounding quotes from the value if present
    value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//')

    echo "Adding $key..."
    echo "$value" | vercel env add $key $ENVIRONMENT
done < "$INPUT_FILE"

echo "All variables from '$INPUT_FILE' have been added to the '$ENVIRONMENT' environment on Vercel."