import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { MutationCtx } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  callbacks: {
    async createOrUpdateUser(ctx: MutationCtx, args) {
      // If user already exists, just return the existing user ID
      if (args.existingUserId) {
        return args.existingUserId;
      }

      // Create a new user with required fields and default values
      const userId = await ctx.db.insert("users", {
        // Auth-related fields
        email: args.profile.email as string | undefined,
        emailVerificationTime: args.profile.emailVerificationTime as number | undefined,

        // Required fields with default values - these will be updated during profile creation
        userName: "",
        name: "",
        profilePicture: "",
        gender: "other",
        birthDate: "",
        country: "",
        isPremium: false
      });

      return userId;
    },
  },
});
