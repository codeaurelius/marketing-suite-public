import { internalMutation } from './_generated/server';
import type { MutationCtx } from './_generated/server';

// Provide explicit type arguments for input, output, and metadata
export const landingPageMigration = internalMutation<undefined, void>({
  handler: async (ctx: MutationCtx): Promise<void> => {
    const { db } = ctx;
    const rows = await db.query('landingPages').collect();
    for (const row of rows) {
      // If published is undefined, set it to false
      if (row.published === undefined) {
        await db.patch(row._id, { published: false });
      }
    }
  },
});

export const createDefaultTenant = internalMutation<undefined, void>(
  async ({ db }: MutationCtx) => {
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
  }
);
