// lib/auth.ts
// NextAuth.js v5 configuration for visualgv.com

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";
import { z } from "zod";

// Email/password login schema
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials format
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.password) {
          return null;
        }

        // Verify password
        const isPasswordValid = await compare(
          parsed.data.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      // Log sign-in event for audit trail
      if (user.id) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "USER_SIGNED_IN",
            resourceType: "user",
            resourceId: user.id,
          },
        });
      }
    },
  },
});
