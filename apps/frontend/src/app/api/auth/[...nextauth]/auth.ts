// app/api/auth/[...nextauth]/auth.ts
import GoogleProvider from 'next-auth/providers/google';
import { getBaseUrl } from '@/config/envConfig';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
  },
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === 'google') {
        try {
          // Use the correct API base URL with /api/v1
          const apiUrl = `${getBaseUrl()}/auth/oauth-login`;
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
              provider: 'google',
              providerId: account.providerAccountId,
              img: user.image,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            user.data = data; // Add this to store user info
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error('OAuth sign in error:', error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account, trigger, session }: any) {
      if (account && user) {
        token.userData = user.data;
        token.provider = account.provider;
      }

      // Handle session updates - update the token with new session data
      if (trigger === 'update' && session?.loggedUser) {
        if (token.userData?.data?.user) {
          token.userData.data.user.role = session.loggedUser.role;
        }
      }

      return token;
    },

    async session({ session, token, trigger, newSession }: any) {
      if (token.userData?.data?.user && token.userData?.data?.accessToken) {
        const userData = token.userData.data.user;

        // If session is being updated with new data, use the provided data
        if (trigger === 'update' && newSession?.loggedUser) {
          session.loggedUser = newSession.loggedUser;
          return session;
        }

        session.loggedUser = {
          userId: userData._id || userData.id,
          role: userData.role,
          name:
            userData.firstName && userData.lastName
              ? `${userData.firstName} ${userData.lastName}`
              : session.user?.name,
          img: userData.img || session.user?.image,
          accessToken: token.userData?.data?.accessToken,
          provider: token.provider || 'google',
          email: userData.email || session.user?.email,
        };
      }

      return session;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
};
