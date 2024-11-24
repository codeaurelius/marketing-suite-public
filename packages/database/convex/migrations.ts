// async function backfillLandingPageStatus() {
//   const landingPages = await server.landingPages.findAll();

import { internalMutation } from './_generated/server';

export const landingPageMigration = internalMutation(async ({ db }) => {
  const rows = await db.query('landingPages').collect();
  for (const row of rows) {
    // if published is undefined, set it to false
    if (row.published === undefined) {
      await db.patch(row._id, { published: false });
    }
  }
});

export const createDefaultTenant = internalMutation(async ({ db }) => {
  const tenants = await db.query('tenants').collect();
  if (tenants.length === 0) {
    await db.insert('tenants', {
      name: 'SuperAdmin',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'active',
      ownerId: 'system', // You might want to replace this with a proper system user ID
    });
  }
});
