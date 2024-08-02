#### A browser extension for copying tabs to the clipboard in a variety of formats

Available for [Chrome](https://chromewebstore.google.com/detail/tab-copy/micdllihgoppmejpecmkilggmaagfdmb)

<div>&nbsp;</div>

<div align="center"><img src="https://hansifer.com/hosted-assets/tab-copy/popup-side-by-side-2023-12-11.png" width="500"></div>

<div>&nbsp;</div>

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

## Tech notes

This project was scaffolded with [create-chrome-ext](https://github.com/guocaoyi/create-chrome-ext)

## Issues

- `npm run dev` does not copy all `/public` files to `/build`. Copy missing `/icons` and `/img` files manually.

### Direct DOM calls vs React

The popup is implemented with static HTML and vanilla JS/direct DOM calls. The original intent of this was to optimize load speed, but the ultimate performance benefit and maintenance tradeoff are open to question.

The options page is implemented in React for better maintainability and to more easily support complex interactions like drag-drop list re-ordering.
