When generating new features, use this global guidelines:
- all APP features should be created in the `apps/app` directory
- all database related changes should be created in the `packages/database/` directory
- always import the convex api object from `@repo/database` instead of `@repo/database/convex/_generated/api`
- wnen updating the database scheme, need to create migration scripts for the affected tables
- when using useQuery to get data from the database, ensure that that is done inside a client component
- all form submit buttons should be disabled unless all form fields are valid