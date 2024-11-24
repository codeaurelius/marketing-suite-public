import { env } from '@repo/env';
import { ConvexClient } from 'convex/browser';

// Create the Convex client for server-side operations
export const convex = new ConvexClient(env.NEXT_PUBLIC_CONVEX_URL);
