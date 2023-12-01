#### A browser extension enabling copy of tabs to the clipboard in a variety of formats

Available for [Chrome](https://chromewebstore.google.com/detail/tab-copy/micdllihgoppmejpecmkilggmaagfdmb)

<div>&nbsp;</div>

<div align="center"><img src="https://hansifer.com/hosted-assets/tab-copy/popup.png" width="208"></div>

<div>&nbsp;</div>

## Developing

### Setup

1. Ensure you're on `Node.js` version 14 or newer
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

### Direct DOM manipulation vs React

The popup is implemented with static HTML and direct DOM calls for load speed. Due to its simplicity, the value to be gained from the use of a front-end lib or framework is relatively small.

The options page is implemented with React to support more complex interactions such as drag-drop list re-ordering.
