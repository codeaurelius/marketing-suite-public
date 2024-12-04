#!/bin/bash

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Error: Vercel CLI is not installed. Install it using 'npm install -g vercel'."
    exit 1
fi

# Usage function
usage() {
    echo "Usage: $0 -f <input-file> -e <vercel-environment>"
    echo "  -f <input-file>         Path to the .env file containing environment variables"
    echo "  -e <vercel-environment> Target Vercel environment (preview, production, or development)"
    exit 1
}

# Parse flags
while getopts "f:e:" opt; do
    case $opt in
        f) INPUT_FILE="$OPTARG" ;;
        e) ENVIRONMENT="$OPTARG" ;;
        *) usage ;;
    esac
done

# Validate input file
if [ -z "$INPUT_FILE" ] || [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file not specified or does not exist."
    usage
fi

# Validate environment
if [ -z "$ENVIRONMENT" ] || [[ ! "$ENVIRONMENT" =~ ^(preview|production|development)$ ]]; then
    echo "Error: Invalid or missing Vercel environment. Must be 'preview', 'production', or 'development'."
    usage
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