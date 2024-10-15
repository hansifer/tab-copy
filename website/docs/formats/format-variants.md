---
sidebar_position: 3
---

# Format variants

A format variant represents a level of fidelity for clipboard content.

All formats generate at a minimum a *plaintext* variant. Some formats also include a *rich-text* variant for more advanced use cases that gets written to the clipboard alongside the plaintext variant.

The applied variant depends on where tabs are pasted.

An example of a format featuring a rich-text variant is `Link`. Tabs that were copied as `Link` paste into documents, spreadsheets, Slack, or email drafts as [clickable links](https://en.wikipedia.org/wiki/Hyperlink). In apps like text editors that do not support clickable links, they paste as plaintext URLs instead.

Custom formats also feature a rich-text variant, since `link` is an available template token.
