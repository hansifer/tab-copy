---
sidebar_position: 1
---

# Built-in formats

This section describes the formats that ship with Tab Copy.

Some of these formats have their own options that can be edited to fine-tune their behavior.

### Link

This format produces [clickable links](https://en.wikipedia.org/wiki/Hyperlink) for pasting into documents, spreadsheets, or an email draft. When pasted into apps that do not support clickable links like text editors, it provides URLs.

When a tab title is missing, the URL displays instead.

#### Plaintext fallback

The **plaintext fallback** option allows you to specify which format is used when pasting into apps that do not support clickable links. This option defaults to **URL** for new installs and **Title** for those migrating from Tab Copy v3.

### URL

This format pastes tabs as simple URLs regardless of where they're pasted.

### Title: URL

This format renders each tab title and URL on a single line.

#### Separator

The text separating titles from URLs can be customized. By default it is `: `.

The maximum length of a separator is 6 characters.

In the rare case that a tab doesn't have a title, the title will appear as `(untitled)`.

### Title & URL

This format writes each tab title and URL on its own line, separating tabs vertically with a blank line.

When a tab title is missing, the title will appear as `(untitled)`.

### Title

This format renders tabs simply as tab titles.

When a tab title is missing, the URL will display instead.

### Markdown

This format transforms tabs into [Markdown links](https://www.markdownguide.org/basic-syntax/#links).

When a tab title is missing, the URL will display instead.

### BBCode

This format transforms tabs into [Bulletin Board Code links](https://www.bbcode.org/creating-links-with-bbcode.php).

When a tab title is missing, the URL will display instead.

### CSV

This format emits tabs as [comma-separated values](https://en.wikipedia.org/wiki/Comma-separated_values).

`Title` cells are blank for tabs without titles.

When copying **All tabs by window**, the output includes an additional `Window` column.

### JSON

This format outputs tabs as an array of tab objects in [JavaScript Object Notation](https://www.json.org/json-en.html).

When a tab `title` or `favIconUrl` is missing, the respective property is omitted.

When copying **All tabs by window**, the output will be an array of window objects with a `title` and `tabs` property.

#### Properties

Property options allow you to select the tab properties included for each tab object. Available properties are: `title`, `url`, and `favIconUrl`.

At least one property must be selected.

#### Layout

You can opt to pretty-print the JSON output, making it easier to read. When **Pretty** is checked, you can specify the number of spaces used for indentation.

The maximum indent value is `10`.

### HTML

This format transforms tabs into a plaintext list of [HTML anchor tags](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) separated by [br](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br) tags.

When a tab title is missing, the tag's content falls back to the URL.

### HTML table

This format produces an [HTML table](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table) of tabs.

`Title` cells are blank for tabs without titles.

When copying **All tabs by window**, the output includes an additional `Window` column.

#### Include header

By default the table header is not included. You can check the **Include header** option to include it, which will render it as a `<thead>` element.
