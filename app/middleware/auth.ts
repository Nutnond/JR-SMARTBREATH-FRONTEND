// middleware/auth.ts

/**
 * Helper function to decode JWT payload.
 * In a real-world production app, using a robust library like `jwt-decode` is recommended.
 * This simplified version is for demonstration.
 * @param token The JWT string.
 * @returns The decoded payload object or null if decoding fails.
 */
function decodeJwtPayload(token: string): { [key: string]: any } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

export default defineNuxtRouteMiddleware((to) => {
  // This middleware only runs on the client-side because sessionStorage is a browser API.
  if (import.meta.server) {
    return;
  }

  // 1. Check for the access token in sessionStorage.
  // Note: The key is 'accessToken'. You can change this if your key is different.
  const accessToken = sessionStorage.getItem('accessToken');
  const isLoggedIn = !!accessToken; // Converts the token string (or null) to a boolean.

  // 2. If the user is not logged in and is trying to access any page other than '/login',
  //    redirect them to the login page.
  if (!isLoggedIn && to.path !== '/login') {
    return navigateTo('/login');
  }

  // 3. If the user is already logged in and tries to visit the login page,
  //    redirect them to the main menu (or dashboard).
  if (isLoggedIn && to.path === '/login') {
    return navigateTo('/menu');
  }

  // --- Role-Based Access Control (RBAC) ---
  const allowedRoles = to.meta?.roles as string[] | undefined;

  // 4. If the route requires specific roles...
  if (isLoggedIn && allowedRoles && allowedRoles.length > 0) {
    const payload = decodeJwtPayload(accessToken);
    // Assumes the user's role is stored in the JWT payload, e.g., { ..., "role": "admin", ... }
    const userRole = payload?.role as string | undefined;

    if (!userRole) {
      // If the role cannot be found in the token, deny access.
      console.error('Role not found in JWT payload. Access denied.');
      return showError({ statusCode: 403, statusMessage: 'Forbidden: Role Not Specified' });
    }

    // Perform a case-insensitive check to see if the user's role is in the allowed list.
    const isAllowed = allowedRoles.some(
      (allowedRole) => allowedRole.toLowerCase() === userRole.toLowerCase()
    );

    if (!isAllowed) {
      // If the user's role is not permitted, show a 403 Forbidden error.
      console.warn(`Access denied for role "${userRole}" to path "${to.path}".`);
      return showError({ statusCode: 403, statusMessage: 'Forbidden' });
    }
  }
});