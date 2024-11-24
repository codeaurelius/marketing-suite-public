import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    productName: v.string(),
    targetAudience: v.string(),
    keyFeatures: v.string(),
    callToAction: v.string(),
    template: v.union(v.literal('modern'), v.literal('classic')),
    html: v.string(),
    userId: v.string(),
    tenantId: v.id('tenants'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('landingPages', {
      ...args,
      createdAt: now,
      updatedAt: now,
      published: false, // Default to unpublished
    });
  },
});

export const list = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('landingPages')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .order('desc')
      .collect();
  },
});

export const getById = query({
  args: {
    id: v.id('landingPages'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id('landingPages'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    productName: v.optional(v.string()),
    targetAudience: v.optional(v.string()),
    keyFeatures: v.optional(v.string()),
    callToAction: v.optional(v.string()),
    template: v.optional(v.union(v.literal('modern'), v.literal('classic'))),
    html: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    return await ctx.db.patch(id, {
      ...fields,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id('landingPages'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
