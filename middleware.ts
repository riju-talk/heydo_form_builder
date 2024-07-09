import { authMiddleware } from "@clerk/nextjs";
import { pathToRegexp, match, parse, compile, Key } from "path-to-regexp";

const keys: Key[] | undefined = [];
const regexp = pathToRegexp("/submit/", keys);
console.log(regexp);
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
// export default authMiddleware({});
export default authMiddleware({
  ignoredRoutes: ['/submit/(.*)']
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

