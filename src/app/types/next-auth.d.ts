import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      tier: number;
    } & DefaultSession['user'];
  }
  interface User {
    idUser: string;
    tier: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    idUser: string;
    tier: number;
    accessToken?: string;
    refreshToken?: string;
    expires?: number;
  }
}
