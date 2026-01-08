import { Session } from "inspector";
import { Awaitable, DefaultSession, NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

type SessionToken = {
  accessToken: string | undefined;
};

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,

  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.id_token = account.id_token;
      }
      return token;
    },

    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (token) {
        session.accessToken = token.id_token as string;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // console.log('url', url);
      // console.log('baseUrl', baseUrl);

      return url;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
