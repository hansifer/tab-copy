var delimiterDefault = ':  ',
    templateDefault = 'Title: [title], URL: [url]';

function tabText(t, format) {

    switch (format || get('tab-format')) {

        case 'txt2Lines':

            return (t.title && t.title.trim() ? t.title + '\n' : '') + t.url;

        case 'txt1Line':

            return (t.title && t.title.trim() ? t.title + get('tab-format-delimiter') : '') + t.url;

        case 'txtUrlOnly':

            return t.url;

        case 'json':

            return '{' + (t.hasOwnProperty('title') ? '\n   "title": "' + t.title + '",' : '') + '\n   "url": "' + t.url + '" \n}';

        case 'markdown':

            return '[' + (t.title && t.title.trim() ? t.title : t.url) + '](' + t.url + ')';

        case 'bbcode':

            if (t.title && t.title.trim()) {
                return '[url=' + t.url + ']' + t.title + '[/url]';
            }

            return '[url]' + t.url + '[/url]';

        case 'html':

            return '<a href="' + t.url + '" target="_blank">' + (t.title && t.title.trim() ? t.title : t.url) + '</a>';

        case 'custom':

            return get('tab-format-template').replace(/\[\s*title\s*\]/ig, t.hasOwnProperty('title') ? t.title : t.url).replace(/\[\s*url\s*\]/ig, t.url).replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\[\s*newline\s*\]/ig, '\n').replace(/\[\s*tab\s*\]/ig, '\t');

    }
}

function get(key) {
    var val = localStorage.getItem(key);

    if (val) {
        return val;
    }

    // return default
    switch (key) {
        case 'tab-format':
            return 'txt2Lines';
        case 'tab-format-delimiter':
            return delimiterDefault;
        case 'tab-format-template':
            return templateDefault;
    }
}
