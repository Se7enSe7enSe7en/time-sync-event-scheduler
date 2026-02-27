// ============================================================
// AUTH MIDDLEWARE — SpacetimeDB Identity check
// ============================================================
// SpacetimeDB handles auth via Identity (ctx.sender on server,
// connection identity on client). The connection itself IS the
// auth — if you're connected, you're authenticated.
//
// TODO: Implement SpacetimeDB-based auth guard
//   1. Check if the SpacetimeDB connection is active
//      - Use `useSpacetimeDB()` from 'spacetimedb/vue' to get the connection
//      - If `conn.isActive` is false, redirect to a "connecting..." page or login
//   2. Optionally check if the user has a Profile row
//      - Use `useTable(tables.Profile)` to check if the current identity has a profile
//      - If no profile exists, redirect to '/profile' for first-time setup
//
// REFERENCE: See spacetimedb-typescript.md § 8 (React Integration)
//            for identity comparison patterns:
//   const isMe = row.identity.toHexString() === myIdentity.toHexString()
//
// NOTE: For now, this middleware is a no-op so the app remains runnable.
// ============================================================

export default defineNuxtRouteMiddleware((_to, _from) => {
  // TODO: Replace with SpacetimeDB connection check
  // const conn = useSpacetimeDB()
  // if (!conn?.isActive) {
  //   return navigateTo('/login')
  // }
});
