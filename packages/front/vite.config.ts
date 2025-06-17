import { join } from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import alias from "@rollup/plugin-alias";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  plugins: [
    svgr({
      include: /\.svg$/,
      svgrOptions: {
        // icon: true,
      },
    }),
    react(),
    // viteBasicSslPlugin(),
    tsconfigPaths(),
    alias({
      entries: [{ find: "@", replacement: join(__dirname, "src") }],
    }),
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      url: "https://sentry.zbc.su",
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // zod: ['zod'],
          // formik: ['formik'],
          // cropper: ['cropperjs'],
        },
      },
    },
    sourcemap: true,
  },
  css: {
    devSourcemap: configEnv.mode === "development",
  },
  server: {
    port: 3000,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
}));
