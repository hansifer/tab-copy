---
sidebar_position: 1
slug: /
---

import ThemedImage from '@theme/ThemedImage'
import useBaseUrl from '@docusaurus/useBaseUrl'

# Overview

Tab Copy is a browser extension that lets you quickly copy open tabs to the clipboard. When copying tabs, a selected range of tabs is converted to text by applying a particular format.

## Popup

The main way to copy tabs is through the [popup](./category/popup) that appears when you click the Tab Copy icon.

<ThemedImage
  style={{
    width:'232px',
    height:'auto',
    margin:'20px 26px 0',
    filter:'drop-shadow(2px 4px 10px #0000005e)',
  }}
  sources={{
    light: useBaseUrl('/img/popup-light.png'),
    dark: useBaseUrl('/img/popup-dark-lightened.png'),
  }}
  alt="Popup"
/>

## Context menu

You can also copy the current tab, as well as links, images, or videos on a page, using the optional [Tab Copy submenu](./context-menu.md) in the context menu of web pages.

<ThemedImage
  style={{
    width:'378px',
    height:'auto',
    margin:'6px 10px 0',
    filter:'drop-shadow(2px 4px 10px #0000005e)',
  }}
  sources={{
    light: useBaseUrl('/img/context-menu-light.png'),
    dark: useBaseUrl('/img/context-menu-dark.png'),
  }}
  alt="Context menu"
/>

## Keyboard shortcuts

Power users can define their own [keyboard shortcuts](./keyboard-shortcuts.md) to copy tabs.

<ThemedImage
  style={{
    width:'720px',
    height:'auto',
    margin:'10px 8px 10px',
    filter:'drop-shadow(2px 4px 10px #0000005e)',
  }}
  sources={{
    light: useBaseUrl('/img/keyboard-shortcuts-light.png'),
    dark: useBaseUrl('/img/keyboard-shortcuts-dark.png'),
  }}
  alt="Keyboard shortcuts"
/>
