import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const tenants = await ctx.db.query('tenants').collect();

    // For each tenant, get their domains count
    const tenantsWithStats = await Promise.all(
      tenants.map(async (tenant) => {
        const domainsCount = await ctx.db
          .query('domains')
          .filter((q) => q.eq(q.field('tenantId'), tenant._id))
          .collect()
          .then((domains) => domains.length);

        return {
          ...tenant,
          domainsCount,
        };
      })
    );

    return tenantsWithStats;
  },
});

export const getById = query({
  args: { id: v.id('tenants') },
  handler: async (ctx, args) => {
    const tenant = await ctx.db.get(args.id);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Get all domains for this tenant
    const domains = await ctx.db
      .query('domains')
      .filter((q) => q.eq(q.field('tenantId'), args.id))
      .collect();

    // Get all landing pages for this tenant
    const landingPages = await ctx.db
      .query('landingPages')
      .filter((q) => q.eq(q.field('tenantId'), args.id))
      .collect();

    return {
      ...tenant,
      domains,
      landingPages,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const tenant = await ctx.db.insert('tenants', {
      name: args.name,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ownerId: identity.subject,
    });

    // Create tenant user record for the owner
    await ctx.db.insert('tenantUsers', {
      userId: identity.subject,
      tenantId: tenant,
      role: 'owner',
      createdAt: Date.now(),
    });

    return tenant;
  },
});

export const update = mutation({
  args: {
    id: v.id('tenants'),
    name: v.string(),
    status: v.union(v.literal('active'), v.literal('inactive')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Check if user has permission to update this tenant
    const tenantUser = await ctx.db
      .query('tenantUsers')
      .filter((q) =>
        q.and(
          q.eq(q.field('tenantId'), args.id),
          q.eq(q.field('userId'), identity.subject)
        )
      )
      .first();

    if (!tenantUser || tenantUser.role === 'user') {
      throw new Error('Not authorized');
    }

    return await ctx.db.patch(args.id, {
      name: args.name,
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});
