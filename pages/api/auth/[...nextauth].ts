import NextAuth, { TokenSet } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/User";
import { User as UserType } from "../../../utils/data";
import db from "../../../utils/db";
import bcrypt from "bcryptjs";

interface IToken extends TokenSet {
  _id?: string;
  isAdmin?: boolean;
}

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // @ts-ignore
    async jwt({ token, user }: { token: IToken; user: UserType | undefined }) {
      if (user?._id) token.id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },

    async session({ session, token }: { session: any; token: IToken | null }) {
      console.log("token in session", token);
      if (token?.id) session.user._id = token.id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      console.log("session", session);
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      // @ts-ignore
      async authorize<T extends { email: string; password: string }>(
        credentials: T
      ) {
        await db.connect();
        const user: UserType | null = await User.findOne({
          email: credentials?.email,
        });
        await db.disconnect();

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: "f",
            isAdmin: user.isAdmin,
          };
        }
        throw new Error("Invalid username or password");
      },
    }),
  ],
});
