import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Define your tables here
  // Example table:
  users: defineTable({
    name: v.string(),
    email: v.string(),
    createdAt: v.number(),
  }),
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
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
  }),
});
