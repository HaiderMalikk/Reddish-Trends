/* 
- middleware for clerk login
*/
import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default withClerkMiddleware((req) => {
  return NextResponse.next();
});

// include pages that should be protected
export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)", "/login(.*)"],
};
