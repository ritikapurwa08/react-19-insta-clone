import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";
import { MutationCtx } from "./_generated/server";

const CustomEmailAndPassword = Password<DataModel>({
  profile(params) {
    return {
      name: params.name as string,
      email: params.email as string,
      userChats: [],
    };
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [CustomEmailAndPassword],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx: MutationCtx, { userId }) {
      const user = await ctx.db.get(userId);
      if (!user) {
        return;
      }

      await ctx.db.insert("userProfiles", {
        userId,
        bio: `${user.name} add here you bio`,
        location: "this is your location",
        customImage: "",
        uploadedImageStorageId: undefined,
        uploadedImageUrl: "",
        instagram: ` @${user.name}_instagram  ${user.name} add you real instagram url `,
        website: `https://${user.name}.com add you real website url`,
      });
      await ctx.db.insert("userStats", {
        userId,
        postCount: 0,
        savedPostCount: 0,
        followingCount: 0,
        followersCount: 0,
        unreadMessages: 0,
        userFollowers: [],
        userFollowing: [],
        likedPostCount: 0,
      });
      await ctx.db.insert("userPrivacy", {
        imagePreference: "custom",
        messagePrivacy: "everyone",
        showBio: true,
        showEmail: true,
        showFollowers: true,
        showFollowing: true,
        showInstagram: true,
        showJoinedAt: true,
        showLastActive: true,
        showLikedPosts: true,
        showLocation: true,
        showPosts: true,
        showSavedPosts: true,
        showWebsite: true,
        userId,
      });
    },
  },
});
