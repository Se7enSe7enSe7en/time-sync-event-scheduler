// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  telemetry: false,
  devServer: {
    port: 5173,
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],

  // imports: {
  //   dirs: ["./module_bindings"], // TODO: change this later, module_bindings should be /shared folder
  // },
});
