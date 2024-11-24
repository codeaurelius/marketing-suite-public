When generating new features, use this global guidelines:
- all APP features should be created in the `apps/app` directory
- all database related changes should be created in the `packages/database/` directory
- always import the convex api object from `@repo/database` instead of `@repo/database/convex/_generated/api`
- wnen updating the database scheme, need to create migration scripts for the affected tables
- when using useQuery to get data from the database, ensure that that is done inside a client component
- all form submit buttons should be disabled unless all form fields are valid
- mport type { Id } from '@repo/database/convex/_generated/dataModel' instead of importing it from convex/dataModel

Forms:
- always validate the input and use the `useToast` hook to show errors
- add a visual feedback to the form fields (e.g. red border when invalid)
- disable form controls when the form is submitting
- add proper aria attributes to the form controls

Next.js:
- Do not directly access param properties. `params` is now a Promise and should be unwrapped with `React.use()` before accessing properties of the underlying params object.