import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      tier: number;
    } & DefaultSession['user'];
  }
  interface User {
    idUser: number;
    tier: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    idUser: number;
    tier: number;
  }
}
