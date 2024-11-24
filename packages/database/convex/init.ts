import { internal } from './_generated/api';
import { internalMutation } from './_generated/server';

export const seedDefaultTenant = internalMutation(async ({ db }) => {
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

export const init = internalMutation(async (ctx) => {
  await ctx.runMutation(internal.init.seedDefaultTenant);
});
