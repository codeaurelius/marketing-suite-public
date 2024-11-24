#!/bin/bash

# Define an array of tables and their corresponding data files
tables=("landingPageDomains" "landingPages" "domains" "tasks" "tenantUsers" "tenants" "users")

data_file="empty.jsonl"

# Loop through each table and import the data with --replace
for table in "${tables[@]}"; do
  echo "Resetting table: $table with data from $data_file"

  # Run the convex import command
  convex import --replace -y --table "$table" "$data_file"

  if [ $? -eq 0 ]; then
    echo "Successfully reset $table"
  else
    echo "Failed to reset $table" >&2
    exit 1
  fi
done

echo "All tables reset successfully!"