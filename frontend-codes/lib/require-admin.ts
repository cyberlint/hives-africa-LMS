import "server-only";

import { auth } from "@/domains/auth";
// import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { cache } from "react";
import { DEFAULT_LOGIN_REDIRECT, LOGIN_URL } from "@/routes";
import { buildLoginRedirect, getRedirectPathFromReferer } from "@/lib/auth-redirect";

export const requireAdmin = cache(async () => {
       const headersList = await headers();
       const session = await auth.api.getSession({
       headers: headersList,
   });

   if (!session) {
       const referer = headersList.get("referer");
       return redirect(buildLoginRedirect(getRedirectPathFromReferer(referer)));
   }

       if (session.user.role !== "admin") {
       return redirect(DEFAULT_LOGIN_REDIRECT);
   }

   return session;
});