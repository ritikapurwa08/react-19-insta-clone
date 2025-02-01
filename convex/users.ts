import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const currentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return undefined;
    }

    const user = await ctx.db.get(userId);

    return user;
  },
});

export const checkEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const checkEmail = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();

    return checkEmail !== null;
  },
});
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    userProfileId: v.id("userProfiles"),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    customImage: v.optional(v.string()),
    instagram: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userProfile = await ctx.db.get(args.userProfileId);

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    const updateUserProfile = await ctx.db.patch(args.userProfileId, {
      userId: args.userId,
      bio: args.bio || userProfile.bio,
      location: args.location || userProfile.location,
      customImage: args.customImage || userProfile.customImage,
      instagram: args.instagram || userProfile.instagram,
      website: args.website || userProfile.website,
    });

    return updateUserProfile;
  },
});
export const getUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userProfile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    return userProfile;
  },
});

export const updateUserPrivacy = mutation({
  args: {
    userId: v.id("users"),
    userPrivacyId: v.id("userPrivacy"),
    showEmail: v.optional(v.boolean()),
    showInstagram: v.optional(v.boolean()),
    showWebsite: v.optional(v.boolean()),
    showFollowers: v.optional(v.boolean()),
    showFollowing: v.optional(v.boolean()),
    showPosts: v.optional(v.boolean()), // Added showPosts
    showSavedPosts: v.optional(v.boolean()),
    showLikedPosts: v.optional(v.boolean()),
    showLocation: v.optional(v.boolean()),
    showBio: v.optional(v.boolean()),
    showJoinedAt: v.optional(v.boolean()),
    showLastActive: v.optional(v.boolean()),
    imagePreference: v.optional(
      v.union(v.literal("custom"), v.literal("convex"))
    ),
    messagePrivacy: v.optional(
      v.union(v.literal("everyone"), v.literal("followers"), v.literal("none"))
    ),
  },
  handler: async (ctx, args) => {
    const userPrivacy = await ctx.db.get(args.userPrivacyId);

    if (!userPrivacy) {
      throw new Error("User privacy not found");
    }

    const updateUserPrivacy = await ctx.db.patch(args.userPrivacyId, {
      userId: args.userId,
      showEmail: args.showEmail ?? userPrivacy.showEmail, // Use ??
      showInstagram: args.showInstagram ?? userPrivacy.showInstagram, // Use ??
      showWebsite: args.showWebsite ?? userPrivacy.showWebsite, // Use ??
      showFollowers: args.showFollowers ?? userPrivacy.showFollowers, // Use ??
      showFollowing: args.showFollowing ?? userPrivacy.showFollowing, // Use ??
      showPosts: args.showPosts ?? userPrivacy.showPosts, // Added and use ??
      showSavedPosts: args.showSavedPosts ?? userPrivacy.showSavedPosts, // Use ??
      showLikedPosts: args.showLikedPosts ?? userPrivacy.showLikedPosts, // Use ??
      showLocation: args.showLocation ?? userPrivacy.showLocation, // Use ??
      showBio: args.showBio ?? userPrivacy.showBio, // Use ??
      showJoinedAt: args.showJoinedAt ?? userPrivacy.showJoinedAt, // Use ??
      showLastActive: args.showLastActive ?? userPrivacy.showLastActive, // Use ??
      imagePreference: args.imagePreference ?? userPrivacy.imagePreference, // Use ??
      messagePrivacy: args.messagePrivacy ?? userPrivacy.messagePrivacy, // Use ??
    });

    return updateUserPrivacy;
  },
});

export const getUserPrivacy = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userPrivacy = await ctx.db
      .query("userPrivacy")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    return userPrivacy;
  },
});

export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const getUserStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!stats) {
      return {
        followersCount: 0,
        followingCount: 0,
        postCount: 0,
        likedPostCount: 0,
        savedPostCount: 0,
      };
    }

    return {
      followersCount: stats.followersCount,
      followingCount: stats.followingCount,
      postCount: stats.postCount,
      likedPostCount: stats.likedPostCount,
      savedPostCount: stats.savedPostCount,
    };
  },
});
export const updateUserCustomProfile = mutation({
  args: {
    userId: v.id("users"),
    customImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!userProfile) {
      return await ctx.db.insert("userProfiles", {
        userId: args.userId,
        bio: "",
        uploadedImageStorageId: undefined,
        uploadedImageUrl: "",
        location: "",
        customImage: "",
        instagram: "",
        website: "",
      });
    }

    await ctx.db.patch(userProfile._id, {
      userId: args.userId,
      customImage: args.customImage,
    });

    return userProfile;
  },
});
export const getUserCustomProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    const userCustomImage = userProfile?.customImage;

    return userCustomImage;
  },
});
export const getUserUploadedImageUrl = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    const userUploadedImageUrl = userProfile?.uploadedImageUrl;

    return userUploadedImageUrl;
  },
});

export const getAllPaginatedUsers = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").paginate(args.paginationOpts);

    return users;
  },
});
