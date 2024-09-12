<div align="center"><img src="https://tabcopy.com/logo-748.png" height="80"></div>

<h1 align="center">Tab Copy</h1>

<h4 align="center">A browser extension for copying tabs to the clipboard in a variety of formats</h4>

<div>&nbsp;</div>

<div align="center"><img src="https://tabcopy.com/popup.png" height="400"></div>

<div>&nbsp;</div>

_Available for [Chrome](https://chromewebstore.google.com/detail/tab-copy/micdllihgoppmejpecmkilggmaagfdmb)_

## Developing

### Setup

1. Ensure you're on `Node.js` version 18 or newer
2. Run `npm install`
3. Run `npm run dev` to generate `build` folder output
4. Open `chrome://extensions/`
5. Ensure `Developer mode` is toggled on
6. Click `Load unpacked` and select the `build` folder

### Running

```shell
npm run dev
```

### Debugging

Access the popup or options page directly with:

- `chrome-extension://replaceWithExtensionId/popup.html`
- `chrome-extension://replaceWithExtensionId/options.html`

## Known issues

- `npm run dev` fails to:
  - copy all `/public` files to `/build` (`/icons` and some `/img` files are missed)
  - output pages listed in vite config's `build.rollupOptions.input`

## Tech notes

This project was scaffolded with [create-chrome-ext](https://github.com/guocaoyi/create-chrome-ext)

### Direct DOM calls vs React

The popup is implemented with static HTML and vanilla JS/direct DOM calls. The original intent was to optimize load speed, but the ultimate performance benefit and maintenance tradeoffs are open to question.

The options page is implemented in React for better maintainability and support for complex interactions like drag-drop list re-ordering.
