import { join } from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import alias from "@rollup/plugin-alias";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl";
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
      org: "zbc",
      project: "psy",
      url: "https://sentry.zbc.su/",
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
    sourcemap: configEnv.mode === "development",
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
