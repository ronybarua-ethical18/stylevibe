declare module 'next-auth' {
  interface Session {
    backendTokens?: {
      accessToken: string;
      refreshToken: string;
    };
    provider?: string;
  }

  interface User {
    backendTokens?: {
      accessToken: string;
      refreshToken: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendTokens?: {
      accessToken: string;
      refreshToken: string;
    };
    provider?: string;
  }
}
