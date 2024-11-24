import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema(
  {
    // Define your tables here
    // Example table:
    users: defineTable({
      name: v.string(),
      email: v.string(),
      age: v.optional(v.number()),
      createdAt: v.number(),
    }),
    tasks: defineTable({
      text: v.string(),
      isCompleted: v.boolean(),
    }),
    tenants: defineTable({
      name: v.string(),
      status: v.union(v.literal('active'), v.literal('inactive')),
      createdAt: v.number(),
      updatedAt: v.number(),
      ownerId: v.string(),
    }),
    tenantUsers: defineTable({
      userId: v.string(),
      tenantId: v.id('tenants'),
      role: v.union(v.literal('owner'), v.literal('admin'), v.literal('user')),
      createdAt: v.number(),
    }),
    landingPages: defineTable({
      title: v.string(),
      description: v.string(),
      productName: v.string(),
      targetAudience: v.string(),
      keyFeatures: v.string(),
      callToAction: v.string(),
      template: v.union(v.literal('modern'), v.literal('classic')),
      html: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
      userId: v.string(),
      tenantId: v.id('tenants'),
      published: v.boolean(),
      defaultDomainId: v.optional(v.id('domains')),
    }),
    domains: defineTable({
      domain: v.string(),
      tenantId: v.id('tenants'),
      status: v.union(
        v.literal('pending'),
        v.literal('verified'),
        v.literal('failed')
      ),
      verificationToken: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    // New table for mapping domains to landing pages
    landingPageDomains: defineTable({
      landingPageId: v.id('landingPages'),
      domainId: v.id('domains'),
      isDefault: v.boolean(),
      path: v.optional(v.string()), // Optional path for subdirectory routing
      createdAt: v.number(),
      updatedAt: v.number(),
      // Indexes for efficient querying
    })
      .index('by_landing_page', ['landingPageId'])
      .index('by_domain', ['domainId']),
  },
  {
    schemaValidation: true,
  }
);
