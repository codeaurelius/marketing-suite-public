import { env } from '@repo/env';
import { ConvexHttpClient } from 'convex/browser';

// Create the Convex client for server-side operations
export const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);
