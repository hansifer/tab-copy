import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'

import manifest from './src/manifest'

const license = {
  header: `@license
Tab Copy - A browser extension for copying tabs to the clipboard
in a variety of formats.
Copyright (C) 2011-present, Hans Meyer, https://github.com/hansifer`,

  name: `Creative Commons Attribution-NonCommercial-NoDerivatives 4.0
International Public License`,

  detail: `By using the code or any other material in this repository, you
agree to the terms of the following license:

You are free to:

Share - copy and redistribute the material in any medium or format

The licensor cannot revoke these freedoms as long as you follow
the license terms.

Under the following terms:

Attribution - You must give appropriate credit, provide a link to
the license, and indicate if changes were made. You may do so in
any reasonable manner, but not in any way that suggests the
licensor endorses you or your use.

NonCommercial - You may not use the material for commercial purposes.

NoDerivatives - If you remix, transform, or build upon the material,
you may not distribute the modified material.

No additional restrictions - You may not apply legal terms or
technological measures that legally restrict others from doing
anything the license permits.

No warranties are given. The license may not give you all of the
permissions necessary for your intended use. For example, other rights
such as publicity, privacy, or moral rights may limit how you use
the material.`,

  link: `Full Text of the License:
https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode`,
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: 'esnext',
    emptyOutDir: true,
    outDir: 'build',
    rollupOptions: {
      input: {
        // pages in addition to those in the extension manifest
        offscreen: 'offscreen.html',
        installNotification: 'install-notification.html',
        releaseNotification: 'release-notification.html',
      },
      output: {
        chunkFileNames: 'assets/chunk-[hash].js',
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  plugins: [
    // wrap
    crx({ manifest }),
    react(),
    licenseBoilerplatePlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))

function licenseBoilerplatePlugin() {
  const jsCssLicenseText = getJsCssLicenseText()
  const htmlLicenseText = getHtmlLicenseText()

  return {
    name: 'license-boilerplate',
    generateBundle(_, bundle) {
      for (const file in bundle) {
        const chunk = bundle[file]

        if (chunk.type === 'chunk' && chunk.fileName.endsWith('.js')) {
          chunk.code = `${jsCssLicenseText}\n${chunk.code}`
        } else if (chunk.type === 'asset' && chunk.fileName.endsWith('.css')) {
          chunk.source = `${jsCssLicenseText}\n${chunk.source}`
        }
      }
    },
    transformIndexHtml(html: string) {
      return `${htmlLicenseText}\n${html}`
    },
  }
}

function getJsCssLicenseText() {
  return jsCommentify(`${license.header}

${license.name}

${license.detail}

${license.link}`)
}

function getHtmlLicenseText() {
  return htmlCommentify(`${license.header}

${license.name}

${license.link}`)
}

function jsCommentify(text: string) {
  return `/**
${text
  .split('\n')
  .map((line) => ` * ${line}`)
  .join('\n')}
 */
`
}

function htmlCommentify(text: string) {
  return `<!--
${text}
-->
`
}
