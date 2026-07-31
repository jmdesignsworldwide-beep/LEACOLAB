import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Solo el portal necesita sesión; el sitio público no pasa por aquí.
  matcher: ["/portal/:path*"],
};
