<div align="center"><img src="https://tabcopy.com/logo-748.png" height="80"></div>

<h1 align="center">Tab Copy</h1>

<h4 align="center">A browser extension for copying tabs to the clipboard in a variety of formats</h4>

<div>&nbsp;</div>

<div align="center"><img src="https://tabcopy.com/popup.png" height="400"></div>

<div>&nbsp;</div>

## Features

- Copy the current tab, tabs in the current window, or all tabs

- Optionally group copied tabs by window

- Choose from a wide variety of formats including Link, URL, Title & URL, Markdown, CSV, JSON, HTML, and more

- Create your own formats with powerful template-based authoring

- Use keyboard shortcuts for your most common tab ranges and formats

- Add copy actions to your browser's context menu

- Set up filtering for tabs you don't want to copy

- Fine-tune built-in formats with individual format options

- Hide the copy buttons you don't use

- Hide the formats you don't use and change the ordering of those you do

Read the [usage docs](https://tabcopy.com/docs) for more details.

## Availability

Tab Copy is currently available for [Chrome](https://chromewebstore.google.com/detail/tab-copy/micdllihgoppmejpecmkilggmaagfdmb) and other Chromium-based browsers.

## Help support this project

We can't do this without you.

Please consider [helping out with a donation](https://tabcopy.com/donate) to support the continued development and maintenance of this project.

Check out [what we've done so far](https://tabcopy.com/releases) and [what's planned](https://tabcopy.com/roadmap).

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

- `npm run dev` fails to:
  - copy all `/public` files to `/build` (`/icons` and some `/img` files are missed)
  - output pages listed in vite config's `build.rollupOptions.input`

## Tech notes

This project was scaffolded with [create-chrome-ext](https://github.com/guocaoyi/create-chrome-ext)

### Direct DOM calls vs React

The popup is implemented with static HTML and vanilla JS/direct DOM calls. The original intent was to optimize load speed, but the ultimate performance benefit and maintenance tradeoffs are open to question.

The options page is implemented in React for better maintainability and support for complex interactions like drag-drop list re-ordering.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. See the [LICENSE](./LICENSE) file for more details.