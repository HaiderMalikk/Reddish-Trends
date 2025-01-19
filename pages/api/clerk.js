// pages/api/clerk.js or middleware.ts
import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default withClerkMiddleware((req) => {
  return NextResponse.next();
});

// Ensure this includes the login route matcher
export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)", "/login(.*)"], // Ensure login is not protected
};
