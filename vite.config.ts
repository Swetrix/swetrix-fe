import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import { createRoutesFromFolders } from '@remix-run/v1-route-convention'
import tsconfigPaths from 'vite-tsconfig-paths'

installGlobals()

export default defineConfig({
  server: {
    port: 3000,
  },
  ssr: {
    noExternal: [
      'axios',
      'd3',
      /^d3-*/,
      'nivo',
      /^nivo-*/,
      /^@nivo*/,
      'delaunator',
      'internmap',
      'robust-predicates',
      'marked',
      'billboard.js',
      /^remix-utils.*/,
      /^remix-i18next.*/,
      /^@reduxjs\/toolkit.*/,
      // /^file-saver*/,
    ],
  },
  plugins: [
    remix({
      ignoredRouteFiles: ['**/.*'],
      appDirectory: 'app',
      // assetsBuildDirectory: "public/build",
      // serverBuildPath: "build/index.js",
      // publicPath: "/build/",
      serverModuleFormat: 'cjs',
      routes(defineRoutes) {
        // uses the v1 convention, works in v1.15+ and v2
        return createRoutesFromFolders(defineRoutes)
      },
    }),
    tsconfigPaths(),
  ],
})
