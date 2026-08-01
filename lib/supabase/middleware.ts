import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Refresca la sesión y protege /portal. La única ruta pública bajo /portal
 * es /portal/login.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Sin credenciales no hay portal; deja pasar (no rompe el sitio público).
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const esLogin = path.startsWith("/portal/login");

  if (path.startsWith("/portal") && !esLogin && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/portal/login";
    return NextResponse.redirect(redirectUrl);
  }

  // Si ya hay sesión y visita el login, mándalo al panel.
  if (esLogin && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/portal";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
