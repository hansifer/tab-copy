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

We can't do this without you.

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

Access the popup or options page directly with:

- `chrome-extension://replaceWithExtensionId/popup.html`
- `chrome-extension://replaceWithExtensionId/options.html`

## Known issues

- `npm run dev` fails to output all necessary files
  - `/icons` and some `/img` files in `/public` do not get copied
  - pages listed in vite config's `build.rollupOptions.input` are not output
  - as a workaround, you can use `npm run dev_workaround`, which will automatically rebuild but not auto-refresh.

## Tech notes

This project was scaffolded with [create-chrome-ext](https://github.com/guocaoyi/create-chrome-ext)

### Direct DOM calls vs React

While this is a React app, the popup itself is implemented with static HTML and vanilla JS using direct DOM calls. The original intent was primarily to optimize load speed, although whether this has any meaningful effect remains an open question. The popup's complexity has grown considerably, shifting the value of the performance/maintainability tradeoff.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. See the [LICENSE](./LICENSE) file for more details.