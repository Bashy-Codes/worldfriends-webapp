/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as communities_communities from "../communities/communities.js";
import type * as communities_discussions from "../communities/discussions.js";
import type * as conversations_mutations from "../conversations/mutations.js";
import type * as conversations_queries from "../conversations/queries.js";
import type * as discover from "../discover.js";
import type * as feed_collections from "../feed/collections.js";
import type * as feed_interactions from "../feed/interactions.js";
import type * as feed_posts from "../feed/posts.js";
import type * as friendships_mutations from "../friendships/mutations.js";
import type * as friendships_queries from "../friendships/queries.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as letters_mutations from "../letters/mutations.js";
import type * as letters_queries from "../letters/queries.js";
import type * as moderation from "../moderation.js";
import type * as notifications from "../notifications.js";
import type * as storage from "../storage.js";
import type * as store_internalMutations from "../store/internalMutations.js";
import type * as store_mutations from "../store/mutations.js";
import type * as store_queries from "../store/queries.js";
import type * as users_internalMutations from "../users/internalMutations.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "communities/communities": typeof communities_communities;
  "communities/discussions": typeof communities_discussions;
  "conversations/mutations": typeof conversations_mutations;
  "conversations/queries": typeof conversations_queries;
  discover: typeof discover;
  "feed/collections": typeof feed_collections;
  "feed/interactions": typeof feed_interactions;
  "feed/posts": typeof feed_posts;
  "friendships/mutations": typeof friendships_mutations;
  "friendships/queries": typeof friendships_queries;
  helpers: typeof helpers;
  http: typeof http;
  "letters/mutations": typeof letters_mutations;
  "letters/queries": typeof letters_queries;
  moderation: typeof moderation;
  notifications: typeof notifications;
  storage: typeof storage;
  "store/internalMutations": typeof store_internalMutations;
  "store/mutations": typeof store_mutations;
  "store/queries": typeof store_queries;
  "users/internalMutations": typeof users_internalMutations;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  r2: {
    lib: {
      deleteMetadata: FunctionReference<
        "mutation",
        "internal",
        { bucket: string; key: string },
        null
      >;
      deleteObject: FunctionReference<
        "mutation",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          secretAccessKey: string;
        },
        null
      >;
      deleteR2Object: FunctionReference<
        "action",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          secretAccessKey: string;
        },
        null
      >;
      getMetadata: FunctionReference<
        "query",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          secretAccessKey: string;
        },
        {
          bucket: string;
          bucketLink: string;
          contentType?: string;
          key: string;
          lastModified: string;
          link: string;
          sha256?: string;
          size?: number;
          url: string;
        } | null
      >;
      listMetadata: FunctionReference<
        "query",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          cursor?: string;
          endpoint: string;
          limit?: number;
          secretAccessKey: string;
        },
        {
          continueCursor: string;
          isDone: boolean;
          page: Array<{
            bucket: string;
            bucketLink: string;
            contentType?: string;
            key: string;
            lastModified: string;
            link: string;
            sha256?: string;
            size?: number;
            url: string;
          }>;
          pageStatus?: null | "SplitRecommended" | "SplitRequired";
          splitCursor?: null | string;
        }
      >;
      store: FunctionReference<
        "action",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          secretAccessKey: string;
          url: string;
        },
        any
      >;
      syncMetadata: FunctionReference<
        "action",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          onComplete?: string;
          secretAccessKey: string;
        },
        null
      >;
      upsertMetadata: FunctionReference<
        "mutation",
        "internal",
        {
          bucket: string;
          contentType?: string;
          key: string;
          lastModified: string;
          link: string;
          sha256?: string;
          size?: number;
        },
        { isNew: boolean }
      >;
    };
  };
};
