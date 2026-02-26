// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  telemetry: false,
  devServer: {
    port: 5173,
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  imports: {
    dirs: ["shared/types/**"],
  },
});
