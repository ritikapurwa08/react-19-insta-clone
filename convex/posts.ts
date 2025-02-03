import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator, PaginationResult } from "convex/server";
import { Id } from "./_generated/dataModel";

export const createPost = mutation({
  args: {
    userId: v.id("users"),
    content: v.string(),
    title: v.string(),
    customImage: v.string(),
    uploadedImageStorageId: v.optional(v.id("_storage")),
    uploadedImageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("posts", {
      userId: args.userId,
      title: args.title,
      content: args.content,
      customImage: args.customImage,
    });

    return postId;
  },
});

export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    customImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("post not found");
    }

    const updatePost = await ctx.db.patch(args.postId, {
      title: args.title ?? post.title,
      content: args.content ?? post.content,
      customImage: args.customImage ?? post.customImage,
      updatedAt: Date.now(),
    });

    return updatePost;
  },
});

export const removePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("post not found");
    }
    if (post.uploadedImageStorageId && post.uploadedImageUrl) {
      await ctx.storage.delete(post.uploadedImageStorageId);
    }

    await ctx.db.delete(args.postId);
  },
});

export const likePost = mutation({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const { userId, postId } = args;
    if (!userId) throw new Error("User not found");

    const postInteraction = await ctx.db
      .query("postInteraction")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .unique();

    if (postInteraction) {
      // Add user to likedBy array if not already present
      if (!postInteraction.likedBy.includes(userId)) {
        await ctx.db.patch(postInteraction._id, {
          likedBy: [...postInteraction.likedBy, userId],
          likeCount: postInteraction.likeCount + 1,
        });
      }
    } else {
      await ctx.db.insert("postInteraction", {
        postId,
        userId,
        likedBy: [userId],
        likeCount: 1,
        commentBy: [],
        commentCount: 0,
        savedBy: [],
        saveCount: 0,
      });
    }
  },
});

export const unlikePost = mutation({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const { userId, postId } = args;
    if (!userId) throw new Error("User not found");

    const postInteraction = await ctx.db
      .query("postInteraction")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .unique();

    if (postInteraction) {
      // Remove user from likedBy array
      const updatedLikedBy = postInteraction.likedBy.filter(
        (id) => id !== userId
      );

      await ctx.db.patch(postInteraction._id, {
        likedBy: updatedLikedBy,
        likeCount: Math.max(0, postInteraction.likeCount - 1), // Prevent negative like count
      });
    }
  },
});

export const savePost = mutation({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const { userId, postId } = args;
    if (!userId) throw new Error("User not found");

    const postInteraction = await ctx.db
      .query("postInteraction")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .unique();

    if (postInteraction) {
      // Add user to savedBy array if not already present
      if (!postInteraction.savedBy.includes(userId)) {
        await ctx.db.patch(postInteraction._id, {
          savedBy: [...postInteraction.savedBy, userId],
          saveCount: postInteraction.saveCount + 1,
        });
      }
    } else {
      await ctx.db.insert("postInteraction", {
        postId,
        userId,
        likedBy: [],
        likeCount: 0,
        commentBy: [],
        commentCount: 0,
        savedBy: [userId],
        saveCount: 1,
      });
    }
  },
});

export const unsavePost = mutation({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const { userId, postId } = args;
    if (!userId) throw new Error("User not found");

    const postInteraction = await ctx.db
      .query("postInteraction")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .unique();

    if (postInteraction) {
      // Remove user from savedBy array
      const updatedSavedBy = postInteraction.savedBy.filter(
        (id) => id !== userId
      );

      await ctx.db.patch(postInteraction._id, {
        savedBy: updatedSavedBy,
        saveCount: Math.max(0, postInteraction.saveCount - 1), // Prevent negative save count
      });
    }
  },
});

export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.id("users"),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const { postId, userId, comment } = args;

    // 1. Add the comment to the postComments table
    const commentId = await ctx.db.insert("postComment", {
      postId,
      userId,
      comment,
    });

    // 2. Update the postInteraction table
    const postInteraction = await ctx.db
      .query("postInteraction")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .unique();

    if (postInteraction) {
      await ctx.db.patch(postInteraction._id, {
        commentBy: [...postInteraction.commentBy, userId],
        commentCount: postInteraction.commentCount + 1,
      });
    } else {
      // If no postInteraction, create one (this should ideally not happen if you create a postInteraction when a post is created)
      await ctx.db.insert("postInteraction", {
        postId,
        userId, // This is not entirely accurate as it associates the post with the first commenter. Consider alternatives.
        likedBy: [],
        likeCount: 0,
        commentBy: [userId],
        commentCount: 1,
        savedBy: [],
        saveCount: 0,
      });
    }

    return commentId;
  },
});

export const removeComment = mutation({
  args: {
    commentId: v.id("postComment"),
  },
  handler: async (ctx, args) => {
    const { commentId } = args;

    // 1. Get the comment to retrieve postId and userId
    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // 2. Delete the comment from the postComments table
    await ctx.db.delete(commentId);

    // 3. Update the postInteraction table
    const postInteraction = await ctx.db
      .query("postInteraction")
      .withIndex("by_postId", (q) => q.eq("postId", comment.postId))
      .unique();

    if (postInteraction) {
      const updatedCommentBy = postInteraction.commentBy.filter(
        (id) => id !== comment.userId
      );
      await ctx.db.patch(postInteraction._id, {
        commentBy: updatedCommentBy,
        commentCount: Math.max(0, postInteraction.commentCount - 1), // Prevent negative comment count
      });
    }
  },
});

export const updateComment = mutation({
  args: {
    commentId: v.id("postComment"),
    newComment: v.string(),
  },
  handler: async (ctx, args) => {
    const { commentId, newComment } = args;

    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Update the comment and updatedAt
    await ctx.db.patch(commentId, {
      comment: newComment,
      updatedAt: Date.now(),
    });
  },
});

export const isPostAlreadyLiked = query({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const { userId, postId } = args;

    const postInteraction = await ctx.db
      .query("postInteraction")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .unique();

    if (!postInteraction) {
      return false; // Post doesn't have any interactions yet
    }

    return postInteraction.likedBy.includes(userId);
  },
});

export const isPostAlreadySaved = query({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const { userId, postId } = args;

    const postInteraction = await ctx.db
      .query("postInteraction")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .unique();

    if (!postInteraction) {
      return false; // Post doesn't have any interactions yet
    }

    return postInteraction.savedBy.includes(userId);
  },
});

export const getAllPaginatedPost = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { paginationOpts } = args;
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_creation_time")
      .order("desc")
      .paginate(paginationOpts);
    return posts;
  },
});
export const getPaginatedUserPost = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const { paginationOpts } = args;
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .paginate(paginationOpts);
    return posts;
  },
});

export const getPaginatedLikedPosts = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { userId, paginationOpts } = args;

    const likedPostIds = await ctx.db
      .query("postInteraction")
      .withIndex("by_user_likes", (q) => q.eq("userId", userId))
      .filter((q) => q.neq(q.field("likedBy"), []))
      .paginate(paginationOpts);

    const likedPosts = await Promise.all(
      likedPostIds.page.map(async (postInteraction) => {
        return await ctx.db.get(postInteraction.postId);
      })
    );

    return {
      ...likedPostIds,
      page: likedPosts,
    };
  },
});
export const getPaginatedSavedPosts = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { userId, paginationOpts } = args;

    const savedPosts = await ctx.db
      .query("postInteraction")
      .withIndex("by_user_likes", (q) => q.eq("userId", userId))
      .filter((q) => q.neq(q.field("savedBy"), []))
      .paginate(paginationOpts);

    const likedPosts = await Promise.all(
      savedPosts.page.map(async (postInteraction) => {
        return await ctx.db.get(postInteraction.postId);
      })
    );

    return {
      ...savedPosts,
      page: likedPosts,
    };
  },
});

export const getPostById = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const { postId } = args;
    const post = await ctx.db.get(postId);
    return post;
  },
});

export const getCommentByPostId = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const comment = ctx.db
      .query("postComment")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .collect();

    return comment;
  },
});

export const getCommentByPostId2 = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("postComment")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .collect();

    return Promise.all(
      comments.map(async (comment) => {
        const userProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_userId", (q) => q.eq("userId", comment.userId))
          .unique();

        const user = await ctx.db.get(comment.userId);

        return {
          ...comment,
          username: user?.name ?? "Anonymous",
          customImage: userProfile?.customImage ?? "",
        };
      })
    );
  },
});

export const getPaginatedMostLikedPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { paginationOpts } = args;

    // 1. Fetch paginated post interactions ordered by likeCount
    const likedPostsResult = await ctx.db
      .query("postInteraction")
      .order("desc") // Order by likeCount descending
      .filter((q) => q.gte(q.field("likeCount"), 1)) // Filter out posts with 0 likes
      .paginate({ ...paginationOpts, numItems: 30 }); // Use Convex's pagination

    // 2. Extract post IDs
    const postIds = likedPostsResult.page.map(
      (interaction) => interaction.postId
    );

    // 3. Fetch the corresponding posts
    const posts = await Promise.all(
      postIds.map((postId: Id<"posts">) => ctx.db.get(postId))
    );

    // 4. Combine post data with interaction data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postsWithLikes: (PaginationResult<any>["page"][number] | null)[] =
      posts.map((post) => {
        if (!post) return null; // Handle the case where a post might not exist

        const interaction = likedPostsResult.page.find(
          (p) => p.postId === post._id
        );

        if (!interaction) return null; // Handle the case where interaction is not found

        return {
          ...post,
          likeCount: interaction.likeCount,
          savedCount: interaction.saveCount,
        };
      });

    // 5. Return the paginated result in the correct format
    return {
      page: postsWithLikes,
      isDone: likedPostsResult.isDone,
      continueCursor: likedPostsResult.continueCursor,
    };
  },
});

export const getPaginatedMostSavedPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { paginationOpts } = args;

    // 1. Fetch paginated post interactions ordered by likeCount
    const savedPostResult = await ctx.db
      .query("postInteraction")
      .order("desc") // Order by likeCount descending
      .filter((q) => q.gte(q.field("saveCount"), 1)) // Filter out posts with 0 likes
      .paginate({ ...paginationOpts, numItems: 10 }); // Use Convex's pagination

    // 2. Extract post IDs
    const postIds = savedPostResult.page.map(
      (interaction) => interaction.postId
    );

    // 3. Fetch the corresponding posts
    const posts = await Promise.all(
      postIds.map((postId: Id<"posts">) => ctx.db.get(postId))
    );

    // 4. Combine post data with interaction data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postWithSaved: (PaginationResult<any>["page"][number] | null)[] =
      posts.map((post) => {
        if (!post) return null; // Handle the case where a post might not exist

        const interaction = savedPostResult.page.find(
          (p) => p.postId === post._id
        );

        if (!interaction) return null; // Handle the case where interaction is not found

        return {
          ...post,
          likeCount: interaction.likeCount,
          savedCount: interaction.saveCount,
        };
      });

    // 5. Return the paginated result in the correct format
    return {
      page: postWithSaved,
      isDone: savedPostResult.isDone,
      continueCursor: savedPostResult.continueCursor,
    };
  },
});

const calculateTrendingScore = (
  likeCount: number,
  saveCount: number,
  commentCount: number,
  creationTime: number,
  timeWindow: number
) => {
  // You can adjust the weights and time decay factor here
  const likeWeight = 0.5;
  const saveWeight = 0.7;
  const commentWeight = 0.3;
  const timeDecay = Math.exp(
    -((Date.now() - creationTime) / (timeWindow * 24 * 60 * 60 * 1000))
  );

  return (
    (likeCount * likeWeight +
      saveCount * saveWeight +
      commentCount * commentWeight) *
    timeDecay
  );
};

const customPaginationOptsValidator = v.object({
  cursor: v.union(v.string(), v.null()),
  numItems: v.number(),
});

export const getPaginatedTrendingPosts = query({
  args: {
    paginationOpts: customPaginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { paginationOpts } = args;
    const timeWindow = 7; // Consider posts from the last 7 days
    const oneWeekAgo = Date.now() - timeWindow * 24 * 60 * 60 * 1000;

    // 1. Fetch all post interactions within the time window
    const recentInteractions = await ctx.db.query("postInteraction").collect();

    // 2. Fetch all posts created within the time window
    const recentPosts = await ctx.db
      .query("posts")
      .filter((q) => q.gte(q.field("_creationTime"), oneWeekAgo))
      .collect();

    // 3. Calculate trending scores
    const postScores: { [key: string]: number } = {};
    for (const post of recentPosts) {
      const interaction = recentInteractions.find((i) => i.postId === post._id);
      const likeCount = interaction ? interaction.likeCount : 0;
      const saveCount = interaction ? interaction.saveCount : 0;
      const commentCount = interaction ? interaction.commentCount : 0;

      const trendingScore = calculateTrendingScore(
        likeCount,
        saveCount,
        commentCount,
        post._creationTime,
        timeWindow
      );
      postScores[post._id] = trendingScore;
    }

    // 4. Sort posts by trending score (descending)
    const sortedPostIds = Object.entries(postScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([postId]) => postId as Id<"posts">);

    // 5. Paginate using cursor (FORCING numItems to 30)
    const enforcedNumItems = 30; // Always fetch 30 items
    let paginatedPostIds: Id<"posts">[] = [];

    if (paginationOpts.cursor) {
      // Find the index of the cursor element
      const cursorIndex = sortedPostIds.indexOf(
        paginationOpts.cursor as Id<"posts">
      );

      if (cursorIndex !== -1) {
        // Slice the array starting from the next element after the cursor
        paginatedPostIds = sortedPostIds.slice(
          cursorIndex + 1,
          cursorIndex + 1 + enforcedNumItems
        );
      } else {
        // Invalid cursor: Default to the first 'enforcedNumItems' elements
        paginatedPostIds = sortedPostIds.slice(0, enforcedNumItems);
      }
    } else {
      // If no cursor, take the first 'enforcedNumItems' elements
      paginatedPostIds = sortedPostIds.slice(0, enforcedNumItems);
    }

    // 6. Fetch the corresponding posts for the current page
    const posts = await Promise.all(
      paginatedPostIds.map((postId) => ctx.db.get(postId))
    );

    // 7. Combine post data with interaction data and trending score
    const postsWithTrendingData: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (PaginationResult<any>["page"][number] | null)[] = posts.map((post) => {
      if (!post) return null;

      const interaction = recentInteractions.find((i) => i.postId === post._id);

      return {
        ...post,
        likeCount: interaction?.likeCount || 0,
        saveCount: interaction?.saveCount || 0,
        commentCount: interaction?.commentCount || 0,
        trendingScore: postScores[post._id],
      };
    });

    // 8. Return the paginated result
    const hasMore = sortedPostIds.length > paginatedPostIds.length;
    return {
      page: postsWithTrendingData,
      isDone: !hasMore,
      continueCursor: hasMore
        ? paginatedPostIds[paginatedPostIds.length - 1]?.toString() // Convert Id to string
        : "", // Empty string to indicate no more pages
    };
  },
});

export const getLikedUsers = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const postInteraction = await ctx.db
      .query("postInteraction")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .unique();

    if (!postInteraction) {
      return null;
    }

    const likedUsers = await Promise.all(
      postInteraction.likedBy.map(async (userId) => {
        const userProfile = await ctx.db
          .query("userProfiles")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .unique();
        return {
          name: userProfile?.userId, // Replace with actual user name field if available
          customImage: userProfile?.customImage,
        };
      })
    );

    return {
      likedCount: postInteraction.likeCount,
      likedUsers,
    };
  },
});
