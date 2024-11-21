import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
});
