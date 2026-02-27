// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  telemetry: false,
  devServer: {
    port: 5173,
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],

  // NOTE: shared/types/ was removed (old Supabase/Prisma types).
  // SpacetimeDB types come from module_bindings/ (auto-generated).
  // If you need custom shared types, create them and add the path here.
});
