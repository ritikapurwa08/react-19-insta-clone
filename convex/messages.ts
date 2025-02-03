import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    senderId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { chatId, senderId, content } = args;

    // Insert the new message
    const messageId = await ctx.db.insert("messages", {
      chatId,
      senderId,
      content,
      edited: false,
    });

    // Update unread counts for all participants except the sender
    const chat = await ctx.db.get(chatId);
    if (!chat) throw new Error("Chat not found");

    const updatedUnreadMessages = chat.unreadMessages.map((um) => {
      if (um.userId !== senderId) {
        return { ...um, unreadCount: um.unreadCount + 1 }; // Increment unread count
      }
      return um;
    });

    await ctx.db.patch(chatId, {
      unreadMessages: updatedUnreadMessages,
    });

    return messageId;
  },
});

export const getMessages = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), args.chatId))
      .order("asc")
      .collect();
  },
});

export const markMessagesAsRead = mutation({
  args: {
    chatId: v.id("chats"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { chatId, userId } = args;

    const chat = await ctx.db.get(chatId);
    if (!chat) throw new Error("Chat not found");

    const updatedUnreadMessages = chat.unreadMessages.map((um) => {
      if (um.userId === userId) {
        return { ...um, unreadCount: 0 }; // Reset unread count
      }
      return um;
    });

    await ctx.db.patch(chatId, {
      unreadMessages: updatedUnreadMessages,
    });
  },
});

export const getUnreadMessages = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Fetch all chats where the user is a participant
    const chats = await ctx.db
      .query("chats")
      .filter((q) => q.neq(q.field("participants"), []))
      .collect();

    // Extract unread counts for the user
    const unreadMessages = chats.map((chat) => {
      const unread = chat.unreadMessages.find((um) => um.userId === userId);
      return {
        chatId: chat._id,
        unreadCount: unread ? unread.unreadCount : 0,
      };
    });

    return unreadMessages;
  },
});
