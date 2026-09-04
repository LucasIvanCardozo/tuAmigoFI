import type { Account, AuthOptions, Session, User } from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';
import type { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import { createUser } from '../actions/users/create.action';
import { userUseCases } from '../usecases/user.usecases';

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

export const authOptions: AuthOptions = {
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
      if (!user?.email || !user?.name || !user?.image) {
        throw new Error('Datos del usuario incompletos');
      }
      let existingUser = await userUseCases.findByEmail(user.email);
      if (!existingUser) {
        const { data, error } = await createUser({
          name: user.name,
          email: user.email,
          image: user.image,
        });
        if (error) throw new Error(error);
        if (data) existingUser = data;
      } else if (existingUser.banned) throw new Error('Estas baneado de esta pagina');
      if (!existingUser) throw new Error('Error al crear usuario');
      user.idUser = existingUser.id;
      user.tier = existingUser.tier;
      return true;
    },
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      user?: User | AdapterUser;
      account?: Account | null;
    }) {
      if (user) {
        token.idUser = user.idUser;
        token.tier = user.tier;
      }

      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expires = Date.now() + (account.expires_in as number) * 1000;
      }

      if (token.expires && Date.now() > token.expires) {
        token = await refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const existingUser = await userUseCases.getById(session.user.id);
      if (existingUser.banned) {
        console.warn(`Usuario baneado detectado: ${session.user.email}`);
        return null as unknown as Session;
      }
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
};
