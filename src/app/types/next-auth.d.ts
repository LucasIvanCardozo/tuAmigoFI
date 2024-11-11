import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      admin: boolean;
    } & DefaultSession['user'];
  }
  interface User {
    idUser: number;
    admin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    idUser: number;
    admin: boolean;
  }
}
