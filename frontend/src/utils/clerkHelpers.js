// src/utils/clerkHelpers.js

/**
 * Get the Clerk session token using multiple methods
 */
export const getClerkToken = async () => {
  // Method 1: Check local storage first
  const storedToken = localStorage.getItem('token');
  if (storedToken) return storedToken;

  // Method 2: Get from Clerk session
  try {
    if (window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        localStorage.setItem('token', token);
        return token;
      }
    }
  } catch (e) {
    console.debug('Clerk session token retrieval failed:', e.message);
  }

  // Method 3: Check Clerk's localStorage
  try {
    const clerkSession = localStorage.getItem('clerk-db-jwt');
    if (clerkSession) {
      const parsed = JSON.parse(clerkSession);
      const token = parsed?.token || parsed;
      if (token && typeof token === 'string') {
        localStorage.setItem('token', token);
        return token;
      }
    }
  } catch (e) {
    // ignore
  }

  return null;
};

/**
 * Check if user is authenticated with Clerk
 */
export const isClerkAuthenticated = () => {
  return !!(
    window.Clerk?.user ||
    window.Clerk?.session ||
    localStorage.getItem('clerk-db-jwt')
  );
};