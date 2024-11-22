<div align="center"><img src="https://tabcopy.com/logo-748.png" height="80"></div>

<h1 align="center">Tab Copy</h1>

<h4 align="center">A browser extension for copying tabs to the clipboard in a variety of formats</h4>

<div>&nbsp;</div>

<div align="center"><img src="https://tabcopy.com/popup-v4-1-0.png" height="400"></div>

<div>&nbsp;</div>

## Features

- Copy the current tab, tabs in the current window, or all tabs. Optionally group tabs by window.

- Select from a wide variety of formats like Link, URL, Title & URL, Markdown, CSV, JSON, HTML, and more

- Create your own formats with powerful format templates

- Choose between using a popup or copying tabs with one click

- Define keyboard shortcuts for your most commonly used ranges and formats

- Add copy actions to web page context menus

- Set up filtering for tabs you want to omit

- Fine-tune your experience with a robust set of options

Read the [usage docs](https://tabcopy.com/docs) for more.

## Availability

Tab Copy is currently available for [Chrome](https://chromewebstore.google.com/detail/tab-copy/micdllihgoppmejpecmkilggmaagfdmb) and other Chromium-based browsers.

## Help support this project

Please consider [helping out with a donation](https://tabcopy.com/donate) to enable the continued development and maintenance of this project.

Check out [what's been done so far](https://tabcopy.com/releases) and [what's planned](https://tabcopy.com/roadmap).

## Developing

### Setup

1. Ensure you're on `Node.js` version 18 or newer
1. Run `npm install`
1. Run `npm run dev` to generate `build` folder output
1. Open `chrome://extensions/`
1. Ensure `Developer mode` is toggled on
1. Click `Load unpacked` and select the `build` folder

### Running

```shell
npm run dev
```

### Debugging

#### Popup

Right-click the extension icon, then click **Inspect popup**.

You can also access the popup in a separate tab at:

`chrome-extension://replaceWithExtensionId/popup.html`

#### Options

Open the options page directly at:

`chrome-extension://replaceWithExtensionId/options.html`

## Known issues

- `npm run dev` fails to output all necessary files
  - `/icons` and some `/img` files in `/public` do not get copied
  - pages listed in vite config's `build.rollupOptions.input` are not output
  - as a workaround, you can use `npm run dev_workaround`, which will automatically rebuild but not auto-refresh

## Tech notes

This project was scaffolded with [create-chrome-ext](https://github.com/guocaoyi/create-chrome-ext)

### Legacy clipboard write

Non-popup copy triggers like keyboard shortcuts, context menus, and one-click copy cannot use the [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) because of limitations introduced by [Manifest v3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3). Such copy actions need to be processed by the background process, which is now required to be a service worker. Service workers (and more broadly web workers) have limited access to DOM APIs and the Clipboard API is not among those permitted.

The solution is to use an [offscreen document](https://developer.chrome.com/docs/extensions/reference/api/offscreen) to process non-popup clipboard writes. This comes with some challenges as offscreen documents have somewhat nuanced behaviors and limitations and require their lifecycle to be managed by the app. Additionally, while an offscreen document provides access to DOM APIs, it's still not possible to use the Clipboard API here since the API's [`write()`](https://w3c.github.io/clipboard-apis/#dom-clipboard-write) method requires the document to be focused. Therefore, the offscreen document must use a legacy clipboard write approach involving programmatically setting the value of a [Textarea element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) to the desired content, selecting the content, and subsequently calling `document.execCommand('copy')`.

While the legacy clipboard write approach works, care must be taken when used in an offscreen document context. To prevent race conditions that lead to silent copy failures, offscreen document teardown cannot happen immediately after the `execCommand('copy')` call. To address this and related concerns, Tab Copy implements a single offscreen document servicing multiple use cases and manages its lifecycle by spinning up a document on-demand, ensuring only one instance exists at a time, and closing it after a period of inactivity.

Offscreen document plumbing and management is implemented in the [offscreen actions module](./src/offscreen-actions.ts). The [clipboard utility module](./src/util/clipboard.ts) contains functions for both standard and legacy clipboard writes.

### Direct DOM calls vs React

While this is a React app, the popup itself is implemented with HTML and vanilla JS using direct DOM calls. The original intent was primarily to optimize load speed, although whether this has any meaningful effect is an open question. The popup's complexity has grown considerably, shifting the value of the performance/maintainability tradeoff.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. See the [LICENSE](./LICENSE) file for more details.