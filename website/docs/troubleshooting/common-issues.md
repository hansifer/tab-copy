---
sidebar_position: 2
---

# Common issues

### Copy fails

If Tab Copy fails to copy tabs, open the [console](./console.md) and try to copy again. Then screenshot or copy any errors logged to the console and paste them into an email to support@tabcopy.com.

### Tab Copy icon does not appear on the toolbar of Incognito windows

If the Tab Copy icon does not appear on the toolbar of Incognito windows, ensure that **Allow in Incognito** is toggled on in [Extension settings](../extension-settings.md)

### Copy does not include Incognito tabs

If you'd like Tab Copy to include Incognito tabs, toggle on **Allow in Incognito** in [Extension settings](../extension-settings.md)

### Tab-delimited values aren't separated into cells when pasting into a spreadsheet

When using the `TAB` token `[t]` with a [custom format](../formats/custom-formats.mdx), you may expect this token to break field values into cells when pasting into a spreadsheet. While this is supported, it requires some familiarity with [format variants](../formats/format-variants.md) and how they're applied.

Tab Copy copies custom formats to the clipboard in 2 variants: *plaintext* and *rich-text*. Applications like spreadsheets typically apply the rich-text variant during paste when available. However, if you want tab-delimited values to be placed into cells accordingly, you must apply the plaintext variant.

:::note
In Tab Copy v3, only the plaintext variant was written to the clipboard for custom formats
:::

Many apps support the `Shift + Ctrl + v` keyboard shortcut (or `Shift + Cmd + v` on a Mac) as an alternative to `Ctrl + v` that pastes as plaintext. If the spreadsheet app you're using doesn't support this shortcut, there may be another shortcut available to speed up pasting as plaintext. In Excel on Windows for example, you can use `Ctrl + Alt + v` to open the **Paste Special** dialog, then press `T` to select **Text** (or **Values** in some versions) and hit `Enter`.
