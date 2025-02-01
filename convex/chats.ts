import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createChat = mutation({
  args: {
    participantIds: v.array(v.id("users")),
    isGroup: v.boolean(),
    groupName: v.optional(v.string()),
    groupProfilePic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const chatId = await ctx.db.insert("chats", {
      participants: args.participantIds,
      isGroup: args.isGroup,
      groupName: args.groupName,
      groupProfilePic: args.groupProfilePic,
    });

    for (const participantId of args.participantIds) {
      await ctx.db.insert("chatParticipants", {
        chatId,
        userId: participantId,
      });
    }

    return chatId;
  },
});

export const getUserChats = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const chatParticipants = await ctx.db
      .query("chatParticipants")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const chatIds = chatParticipants.map((cp) => cp.chatId);

    const chats = await Promise.all(
      chatIds.map(async (chatId) => {
        const chat = await ctx.db.get(chatId);
        if (!chat) {
          return null;
        }
        const participants = await Promise.all(
          chat.participants.map(async (participantId) => {
            return await ctx.db.get(participantId);
          })
        );
        return { ...chat, participants };
      })
    );

    return chats;
  },
});

export const getChatBetweenUsers = query({
  args: {
    memberOneId: v.id("users"),
    memberTwoId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Step 1: Get all chat IDs where memberOneId is a participant
    const memberOneChats = await ctx.db
      .query("chatParticipants")
      .filter((q) => q.eq(q.field("userId"), args.memberOneId))
      .collect();

    // Step 2: For each chat, check if memberTwoId is also a participant
    for (const participant of memberOneChats) {
      const chatId = participant.chatId;
      const isMemberTwoInChat = await ctx.db
        .query("chatParticipants")
        .filter((q) =>
          q.and(
            q.eq(q.field("chatId"), chatId),
            q.eq(q.field("userId"), args.memberTwoId)
          )
        )
        .first();

      if (isMemberTwoInChat) {
        // If both users are in the same chat, return the chat ID
        return chatId;
      }
    }

    // Step 3: If no chat exists, return null
    return null;
  },
});
