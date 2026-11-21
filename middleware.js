export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

export function middleware(request) {
  const username = process.env.SITE_USERNAME;
  const password = process.env.SITE_PASSWORD;

  // If either credential is missing, no Basic Auth gate is enabled.
  if (!username || !password) return;

  const authorization = request.headers.get("authorization") || "";
  if (authorization.startsWith("Basic ")) {
    try {
      const decoded = atob(authorization.slice(6));
      const separator = decoded.indexOf(":");
      const suppliedUser = decoded.slice(0, separator);
      const suppliedPassword = decoded.slice(separator + 1);
      if (separator >= 0 && suppliedUser === username && suppliedPassword === password) {
        return;
      }
    } catch {
      // Continue to the authentication challenge.
    }
  }

  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Private Turkish-French Translator", charset="UTF-8"',
      "Cache-Control": "no-store"
    }
  });
}
