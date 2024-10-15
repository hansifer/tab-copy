import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
  title: 'Tab Copy',
  tagline:
    'A browser extension that lets you quickly copy tabs to the clipboard in a variety of formats.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://tabcopy.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'facebook', // Usually your GitHub org/user name.
  // projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/hansifer/tab-copy/tree/master/website',
        },
        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        //   // Useful options to enforce blogging best practices
        //   onInlineTags: 'warn',
        //   onInlineAuthors: 'warn',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: ['/contribute'],
            to: '/donate',
          },
        ],
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    tableOfContents: {
      maxHeadingLevel: 5,
    },
    image: 'img/tab-copy-social-card.png',
    navbar: {
      title: 'Tab Copy',
      logo: {
        alt: 'Tab Copy Logo',
        src: 'img/logo-128.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          label: 'Docs',
          position: 'left',
        },
        {
          to: '/releases',
          label: 'Releases',
          position: 'left',
        },
        {
          to: '/roadmap',
          label: 'Roadmap',
          position: 'left',
        },
        {
          to: '/donate',
          label: 'Donate',
          position: 'left',
        },
        {
          href: 'https://chromewebstore.google.com/detail/tab-copy/micdllihgoppmejpecmkilggmaagfdmb',
          label: 'Install',
          position: 'right',
        },
        // { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/hansifer/tab-copy',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Links',
          items: [
            {
              label: 'Privacy policy',
              to: '/privacy',
            },
            {
              label: 'Install',
              href: 'https://chromewebstore.google.com/detail/tab-copy/micdllihgoppmejpecmkilggmaagfdmb',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/hansifer/tab-copy',
            },
          ],
        },
        {
          title: 'Other apps',
          items: [
            {
              label: 'Session Buddy',
              href: 'https://sessionbuddy.com',
            },
            {
              label: 'Close Tab',
              href: 'https://chromewebstore.google.com/detail/close-tab/lnchemdcmhoccciihokpdkkekmnejfhj',
            },
            {
              label: 'Wordle All Day',
              href: 'https://wordle-all-day.vercel.app/',
            },
          ],
        },
        // {
        //   title: 'Community',
        //   items: [
        //     {
        //       label: 'Stack Overflow',
        //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
        //     },
        //     {
        //       label: 'Discord',
        //       href: 'https://discordapp.com/invite/docusaurus',
        //     },
        //     {
        //       label: 'Twitter',
        //       href: 'https://twitter.com/docusaurus',
        //     },
        //   ],
        // },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} hansifer`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
