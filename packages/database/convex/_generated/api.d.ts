/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as domains from "../domains.js";
import type * as init from "../init.js";
import type * as landingPages from "../landingPages.js";
import type * as migrations from "../migrations.js";
import type * as tasks from "../tasks.js";
import type * as tenants from "../tenants.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  domains: typeof domains;
  init: typeof init;
  landingPages: typeof landingPages;
  migrations: typeof migrations;
  tasks: typeof tasks;
  tenants: typeof tenants;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
