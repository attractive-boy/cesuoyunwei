import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prismaClient";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      tenantId: process.env.AZURE_TENANT_ID,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: { azureId: account?.providerAccountId, name: user.name },
          create: { email: user.email, name: user.name, azureId: account?.providerAccountId },
        });
        return true;
      } catch (err) {
        console.error('NextAuth signIn upsert error:', err);
        return false;
      }
    },
    async session({ session }) {
      if (session?.user?.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
        session.user.role = dbUser?.role || 'viewer';
        session.user.id = dbUser?.id || null;
      }
      return session;
    },
  },
});