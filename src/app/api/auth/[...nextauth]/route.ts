import { createUser } from '@/app/lib/actions';
import { fetchUser } from '@/app/lib/data';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: token.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw new Error(refreshedTokens.error);
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expires: Date.now() + refreshedTokens.expires_in * 1000,
    };
  } catch (error) {
    console.error('Error al refrescar el token:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

const authOptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      try {
        if (!user?.email || !user?.name || !user?.image) {
          console.error('Datos del usuario incompletos');
          return false;
        }
        let existingUser = await fetchUser(user.email);
        if (!existingUser) {
          existingUser = await createUser({
            name: user.name!,
            email: user.email!,
            image: user.image!,
          });
        }
        user.idUser = existingUser.id;
        user.tier = existingUser.tier;
        return true;
      } catch (error) {
        console.error('Error en signIn:', error);
        return false;
      }
    },
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      user?: any;
      account?: any;
    }) {
      if (user) {
        token.idUser = user.idUser;
        token.tier = user.tier;
      }

      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expires = Date.now() + account.expires_in * 1000;
      }

      if (token.expires && Date.now() > token.expires) {
        token = await refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.user = {
        id: token.idUser,
        tier: token.tier,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      };
      return session;
    },
  },
});

export { authOptions as GET, authOptions as POST };
