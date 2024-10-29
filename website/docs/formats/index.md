---
sidebar_position: 5
---

# Formats

Formats allow you to control how tabs are transformed before being copied to the clipboard.

Tab Copy ships with several [built-in formats](./built-in-formats) catered to the most common use cases.

You can also [define your own formats](./custom-formats) to suit your particular needs using templates.

Most formats write a single plaintext version of content to the clipboard, whereas some formats produce multiple [variants](./format-variants).

## Format order

Tab Copy provides special handling for the *default*, *secondary*, and *third* format as determined by the order of formats in [Tab Copy options](../options#formats).

### Default format

The default format is applied when copying tabs without explicitly selecting a format, whether through the [popup](../popup), [context menu](../context-menu), or a [keyboard shortcut](../keyboard-shortcuts).

This format can be set by dragging the desired format tile into the top visible position in the list of formats on the [Tab Copy options page](../options#formats).

### Secondary format

The secondary format can be applied by holding down the `Ctrl` or `Cmd` key while copying tabs using the [popup](../popup).

This format can be set by dragging the desired format tile into the second visible position in the list of formats on the [Tab Copy options page](../options#formats).

### Third format

The third format can be applied by holding down `Shift + Ctrl` or `Shift + Cmd` while copying tabs using the [popup](../popup).

This format can be set by dragging the desired format tile into the third visible position in the list of formats on the [Tab Copy options page](../options#formats).

## Grouping by window

When copying **All windows and tabs**, tabs are grouped by window. How this is done depends on the format.

List-based formats such as **Link**, **URL**, or **Markdown** output numbered window headers separating groups of tabs.

Tabular formats like **CSV** or **HTML table** prepend an additional `Window` column.

Tree-structured formats like **JSON** end up with an extra level of nesting.
