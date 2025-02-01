import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const Tables = () => {
  const userProfileTable = defineTable({
    userId: v.id("users"),
    bio: v.string(),
    location: v.string(),
    customImage: v.string(),
    uploadedImageStorageId: v.optional(v.id("_storage")),
    uploadedImageUrl: v.string(),
    instagram: v.string(),
    website: v.string(),
  }).index("by_userId", ["userId"]);

  const userStatsTables = defineTable({
    userId: v.id("users"),
    followersCount: v.number(),
    followingCount: v.number(),
    userFollowers: v.array(v.id("users")),
    userFollowing: v.array(v.id("users")),
    postCount: v.number(),
    likedPostCount: v.number(),
    savedPostCount: v.number(),
    unreadMessages: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_followersCount", ["followersCount"])
    .index("by_followingCount", ["followingCount"])
    .index("by_postCount", ["postCount"]);

  const userPrivacyTable = defineTable({
    userId: v.id("users"),
    showEmail: v.boolean(),
    showInstagram: v.boolean(),
    showWebsite: v.boolean(),
    showFollowers: v.boolean(),
    showFollowing: v.boolean(),
    showPosts: v.boolean(),
    showSavedPosts: v.boolean(),
    showLikedPosts: v.boolean(),
    showLocation: v.boolean(),
    showBio: v.boolean(),
    showJoinedAt: v.boolean(),
    showLastActive: v.boolean(),
    imagePreference: v.union(v.literal("custom"), v.literal("convex")),
    messagePrivacy: v.union(
      v.literal("everyone"),
      v.literal("followers"),
      v.literal("none")
    ),
  }).index("by_userId", ["userId"]);

  return {
    userProfileTable,
    userStatsTables,
    userPrivacyTable,
  };
};

const { userProfileTable, userStatsTables, userPrivacyTable } = Tables();

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.string(),
    email: v.string(),
    userChats: v.optional(v.array(v.id("chats"))),
  })
    .index("by_email", ["email"])
    .index("by_chats", ["userChats"]),
  userProfiles: userProfileTable,
  userPrivacy: userPrivacyTable,
  userStats: userStatsTables,
});

export default schema;
