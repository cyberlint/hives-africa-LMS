import "server-only";

import { auth } from "@/domains/auth";
// import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { cache } from "react";
import { DEFAULT_LOGIN_REDIRECT, LOGIN_URL } from "@/routes";

export const requireAdmin = cache(async () => {
       const session = await auth.api.getSession({
       headers: await headers(),
   });

   if (!session) {
       return redirect(LOGIN_URL);
   }

       if (session.user.role !== "admin") {
       return redirect(DEFAULT_LOGIN_REDIRECT);
   }

   return session;
});