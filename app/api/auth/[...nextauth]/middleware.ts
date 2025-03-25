export { default } from 'next-auth/middleware';

// Protect routes with auth
export const config = {
  matcher: ['/dashboard/:path*'],
};
