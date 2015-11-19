// <canonical key>: [ <key aliases> ]
var keyAliases = {
    'format': ['tab-format'],
    'condensed-separator': ['tab-format-delimiter'],
    'custom-tab-template': ['tab-format-template']
};

// <key>: { <translations for values of key> }
var valAliases = {
    'format': {
        'txt1Line': 'condensed',
        'txt2Lines': 'expanded',
        'txtUrlOnly': 'url'
    }
};

function tabsText(wots, clicks, format, cb) {
    format = format || get('format');

    var s = '',
        tabCount = 0;

    var appendTab = (function(delimiter, format) {
        return function(s, t) {
            if (s.length) {
                s += delimiter;
            }

            s += tabText(t, format, ++tabCount);

            return s;
        }
    }(tabDelimiter(format), format));

    var wot;
    for (var i = 0; i < wots.length; i++) {
        wot = wots[i];
        if (wot.tabs) { // window
            for (var j = 0; j < wot.tabs.length; j++) {
                s = appendTab(s, wot.tabs[j]);
            }
        } else { // tab
            if (wot.highlighted && clicks === 1 || clicks === 2) {
                s = appendTab(s, wot);
            }
        }
    }

    cb(wrap(s, format, tabCount), tabCount);
}

function tabText(t, format, seq) {

    switch (format || get('format')) {

        case 'expanded':

            return (t.title && t.title.trim() ? t.title + '\n' : '') + t.url;

        case 'condensed':

            return (t.title && t.title.trim() ? t.title + get('condensed-separator') : '') + t.url;

        case 'url':

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

        case 'html-table':

            return '      <tr>\n         <td>' + (t.title && t.title.trim() ? t.title : t.url) + '</td>\n         <td>' + t.url + '</td>\n      </tr>';

        case 'custom':

            return interpolate(get('custom-tab-template'), new Date(), t, seq);

    }
}

function tabDelimiter(format) {

    switch (format || get('format')) {

        case 'expanded':

            return '\n\n';

        case 'json':

            return ',\n';

        case 'custom':

            return interpolate(get('custom-delimiter'));

    }

    return '\n';
}

function wrap(s, format, count) {

    switch (format || get('format')) {

        case 'json':

            return '[' + s + ']';

        case 'html-table':

            return '<table>' + (get('html-table-include-header') === 'true' ? '\n   <thead>\n      <tr>\n         <th>Title</th>\n         <th>URL</th>\n      </tr>\n   </thead>' : '') + '\n   <tbody>\n' + s + '\n   </tbody>\n</table>';

        case 'custom':

            var d = new Date();
            return interpolate(get('custom-start'), d, null, null, count) + s + interpolate(get('custom-end'), d, null, null, count);

    }

    return s;
}

function interpolate(s, d, t, seq, count) {

    // non-prinatbles

    var r = s.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\[\s*newline\s*\]/ig, '\n').replace(/\[\s*tab\s*\]/ig, '\t');

    // datetime

    if (d) {
        r = r.replace(/\[\s*time\s*\]/ig, d.toLocaleTimeString()).replace(/\[\s*date\s*\]/ig, d.toLocaleDateString()).replace(/\[\s*date\+?time\s*\]/ig, d.toLocaleString());
    }

    // tab

    if (t) {
        r = r.replace(/\[\s*title\s*\]/ig, t.hasOwnProperty('title') ? t.title : t.url).replace(/\[\s*url\s*\]/ig, t.url);
    }

    // tab sequence

    if (seq) {
        r = r.replace(/\[\s*number\s*\]/ig, seq);
    }

    // tab count

    if (count != null) {
        r = r.replace(/\[\s*count\s*\]/ig, count);
    }

    return r;
}

function get(key) {
    var val = localStorage.getItem(key);

    if (val) {
        return translate(val, key);
    }

    var aliases = keyAliases[key];

    if (aliases) {
        for (var i = aliases.length; i--;) {
            if ((val = localStorage.getItem(aliases[i]))) {
                return translate(val, key);
            }
        }
    }

    return def(key);
}

function set(key, val) {
    localStorage.setItem(key, val);

    var aliases = keyAliases[key];

    if (aliases) {
        for (var i = aliases.length; i--;) {
            localStorage.removeItem(aliases[i]);
        }
    }
}

function def(key) {
    switch (key) {
        case 'format':
            return 'expanded';
        case 'condensed-separator':
            return ':  ';
        case 'custom-tab-template':
            return '[number]) Title: [title]\\n   URL:   [url]';
        case 'custom-start':
        case 'custom-end':
            return '';
        case 'custom-delimiter':
            return '\\n\\n';
    }
}

function translate(val, key) {
    var aliases = valAliases[key];

    if (!aliases) {
        return val;
    }

    return aliases[val] || val;
}
