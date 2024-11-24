import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const list = query({
  args: {
    tenantId: v.id('tenants'),
  },
  handler: async (ctx, args) => {
    const domains = await ctx.db
      .query('domains')
      .filter((q) => q.eq(q.field('tenantId'), args.tenantId))
      .collect();

    // For each domain, get its landing pages
    const domainsWithPages = await Promise.all(
      domains.map(async (domain) => {
        const mappings = await ctx.db
          .query('landingPageDomains')
          .withIndex('by_domain', (q) => q.eq('domainId', domain._id))
          .collect();

        const landingPageIds = mappings.map((m) => m.landingPageId);
        const landingPages = await Promise.all(
          landingPageIds.map((id) => ctx.db.get(id))
        );

        return {
          ...domain,
          landingPages: landingPages.filter(Boolean),
        };
      })
    );

    return domainsWithPages;
  },
});

export const create = mutation({
  args: {
    domain: v.string(),
    tenantId: v.id('tenants'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Check if user has permission for this tenant
    const tenantUser = await ctx.db
      .query('tenantUsers')
      .filter((q) =>
        q.and(
          q.eq(q.field('tenantId'), args.tenantId),
          q.eq(q.field('userId'), identity.subject)
        )
      )
      .first();

    if (!tenantUser) {
      throw new Error('Not authorized');
    }

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2);

    return await ctx.db.insert('domains', {
      domain: args.domain.toLowerCase(),
      tenantId: args.tenantId,
      status: 'pending',
      verificationToken,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const attachToLandingPage = mutation({
  args: {
    domainId: v.id('domains'),
    landingPageId: v.id('landingPages'),
    isDefault: v.boolean(),
    path: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Get the domain and landing page to verify tenant ownership
    const domain = await ctx.db.get(args.domainId);
    const landingPage = await ctx.db.get(args.landingPageId);

    if (!domain || !landingPage) {
      throw new Error('Domain or landing page not found');
    }

    if (domain.tenantId !== landingPage.tenantId) {
      throw new Error('Domain and landing page must belong to the same tenant');
    }

    // Check user permission for the tenant
    const tenantUser = await ctx.db
      .query('tenantUsers')
      .filter((q) =>
        q.and(
          q.eq(q.field('tenantId'), domain.tenantId),
          q.eq(q.field('userId'), identity.subject)
        )
      )
      .first();

    if (!tenantUser) {
      throw new Error('Not authorized');
    }

    // If this is set as default, unset any existing default for this landing page
    if (args.isDefault) {
      const existingMappings = await ctx.db
        .query('landingPageDomains')
        .withIndex('by_landing_page', (q) =>
          q.eq('landingPageId', args.landingPageId)
        )
        .collect();

      for (const mapping of existingMappings) {
        if (mapping.isDefault) {
          await ctx.db.patch(mapping._id, { isDefault: false });
        }
      }

      // Update the landing page's defaultDomainId
      await ctx.db.patch(args.landingPageId, {
        defaultDomainId: args.domainId,
      });
    }

    return await ctx.db.insert('landingPageDomains', {
      domainId: args.domainId,
      landingPageId: args.landingPageId,
      isDefault: args.isDefault,
      path: args.path,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const verifyDomain = mutation({
  args: {
    domainId: v.id('domains'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const domain = await ctx.db.get(args.domainId);
    if (!domain) {
      throw new Error('Domain not found');
    }

    // TODO: Implement actual domain verification logic here
    // This could involve checking DNS records or making HTTP requests

    return await ctx.db.patch(args.domainId, {
      status: 'verified',
      updatedAt: Date.now(),
    });
  },
});
