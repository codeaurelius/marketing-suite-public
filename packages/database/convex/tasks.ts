import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Get all tasks
export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('tasks').collect();
  },
});

// Create a new task
export const createTask = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert('tasks', {
      text: args.text,
      isCompleted: false,
    });
    return taskId;
  },
});

// Toggle task completion
export const toggleTask = mutation({
  args: {
    id: v.id('tasks'),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error('Task not found');
    }

    await ctx.db.patch(args.id, {
      isCompleted: !task.isCompleted,
    });
  },
});
