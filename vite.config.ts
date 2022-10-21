import { fileURLToPath, URL } from "node:url"
import { createHtmlPlugin } from "vite-plugin-html"
import { defineConfig } from "vite"
import { loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import cesium from "vite-plugin-cesium"
const env = (mode: string, key: string) => loadEnv(mode, process.cwd())[key]
export default ({ mode }: any) => {
  return defineConfig({
    base: "./",
    build: {
      outDir: "./docs",
    },
    plugins: [
      vue(),
      vueJsx(),
      cesium(),
      createHtmlPlugin({
        inject: {
          data: {
            title: env(mode, "VITE_NAME"),
          },
        },
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      hmr: true,
      host: "0.0.0.0",
    },
  })
}
