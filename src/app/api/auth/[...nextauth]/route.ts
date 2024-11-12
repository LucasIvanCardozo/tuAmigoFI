import { createUser } from '@/app/lib/actions';
import { fetchUser } from '@/app/lib/data';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

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
        if (user?.email) {
          let existingUser = await fetchUser(user.email);

          if (!existingUser) {
            existingUser = await createUser({
              name: user.name,
              email: user.email,
              image: user.image,
            });
          }
          user.idUser = existingUser.id;
          user.tier = existingUser.tier;
          return true;
        } else {
          console.error('No se pudo iniciar sesion!');
          return false;
        }
      } catch (error) {
        console.error('No se pudo iniciar sesion!');
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.idUser = user.idUser;
        token.tier = user.tier;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.idUser;
      session.user.tier = token.tier;
      return session;
    },
  },
});

export { authOptions as GET, authOptions as POST };
