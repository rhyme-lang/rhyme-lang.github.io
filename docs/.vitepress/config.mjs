import { defineConfig } from 'vitepress'

import container from 'markdown-it-container';
import { renderSandbox } from 'vitepress-plugin-sandpack';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Rhyme",
  description: "An Expressive Data-Centric Query Language",
  themeConfig: {
    logo: "https://avatars.githubusercontent.com/u/150201258?s=400&u=c165a8a5fc98d1ddc149652fcdb818e4222f3094&v=4",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Overview', link: '/overview' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Overview', link: '/overview' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Development Setup', link: '/development' },
        ]
      }, {
        text: 'Documentation',
        items: [
          { text: 'Reference', link: '/reference' },
          { text: 'Examples', link: '/examples' },
        ]
      },{
        text: 'Interactive Demos',
        items: [
          { text: 'Display', link: '/display' },
          { text: 'Tables', link: '/tables' },
          { text: 'SVG', link: '/svg' },
          { text: 'React', link: '/react' },
          { text: 'Command Line', link: '/command-line' },
        ]
      }/*{
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/xx-markdown-examples' },
          { text: 'Runtime API Examples', link: '/xx-api-examples' }
        ]
      }*/
    ],

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'npm', link: 'https://www.npmjs.com/package/rhyme-lang' },
      { icon: 'github', link: 'https://github.com/rhyme-lang/rhyme' }
    ]
  },

  markdown: {
    config(md) {
      md
        // the second parameter is html tag name
        .use(container, 'sandbox', {
          render (tokens, idx) {
            return renderSandbox(tokens, idx, 'sandbox');
          },
        });
    },
  },

})
