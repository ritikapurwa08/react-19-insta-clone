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

  const chats = defineTable({
    participants: v.array(v.id("users")),
    isGroup: v.boolean(),
    groupName: v.optional(v.string()),
    groupProfilePic: v.optional(v.string()),
    unreadMessages: v.array(
      v.object({
        userId: v.id("users"),
        unreadCount: v.number(),
      })
    ),
  }).index("by_participants", ["participants"]);

  const messages = defineTable({
    chatId: v.id("chats"),
    senderId: v.id("users"),
    content: v.string(),
    edited: v.boolean(),
    updatedAt: v.optional(v.number()),
  });

  const chatParticipants = defineTable({
    chatId: v.id("chats"),
    userId: v.id("users"),
  });

  const postTable = defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    customImage: v.string(),
    updatedAt: v.optional(v.number()),
    uploadedImageStorageId: v.optional(v.id("_storage")),
    uploadedImageUrl: v.optional(v.string()),
  }).index("by_userId", ["userId"]);
  const postInteractionTable = defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
    likedBy: v.array(v.id("users")),
    likeCount: v.number(),
    commentBy: v.array(v.id("users")),
    commentCount: v.number(),
    savedBy: v.array(v.id("users")),
    saveCount: v.number(),
  })
    .index("by_postId", ["postId"])
    .index("by_user", ["userId"])
    .index("by_user_likes", ["userId", "likedBy"]) // Index for checking if a user has liked a post
    .index("by_user_saves", ["userId", "savedBy"]); // Index for checking if a user has saved a post

  const postCommentTable = defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
    comment: v.string(),
    updatedAt: v.optional(v.number()),
  }).index("by_postId", ["postId"]);

  return {
    userProfileTable,
    userStatsTables,
    userPrivacyTable,
    chats,
    messages,
    chatParticipants,
    postCommentTable,
    postTable,
    postInteractionTable,
  };
};

const {
  userProfileTable,
  userStatsTables,
  userPrivacyTable,
  chatParticipants,
  chats,
  messages,
  postCommentTable,
  postTable,
  postInteractionTable,
} = Tables();

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
  chats: chats,
  messages: messages,
  chatParticipants: chatParticipants,
  posts: postTable,
  postInteraction: postInteractionTable,
  postComment: postCommentTable,
});

export default schema;
