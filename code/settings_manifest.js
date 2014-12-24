this.manifest = {
    "name": "TabCopy",
    "icon": "icons/icon128.png",
    "settings": [
        {
            "tab": i18n.get("copy-format"),
            "group": i18n.get("link-format"),
            "name": "linkFormat",
            "type": "textarea",
            "text": i18n.get("non-empty")
        },
        {
            "tab": i18n.get("copy-format"),
            "group": i18n.get("link-format"),
            "name": "linkFormatDescription",
            "type": "description",
            "text": i18n.get("link-format-description")
        },
        {
            "tab": i18n.get("copy-format"),
            "group": i18n.get("link-separator"),
            "name": "linkSeparator",
            "type": "textarea",
            "text": i18n.get("non-empty")
        },
        {
            "tab": i18n.get("copy-format"),
            "group": i18n.get("link-separator"),
            "name": "linkSeparatorDescription",
            "type": "description",
            "text": i18n.get("link-separator-description")
        },
        {
            "tab": i18n.get("copy-format"),
            "group": i18n.get("other"),
            "name": "trim",
            "type": "checkbox",
            "label": i18n.get("trim-description"),
            "default": true
        }
    ],
    "alignment": [
    ]
};
