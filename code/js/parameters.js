var settings = new Store("settings", {
    linkFormat : '{title}\n{url}',
    linkSeparator : '\n\n',
    trim : true
});

// Additional tab properties under chrome: 
// active, favIconUrl, height, highlighted, id, incognito, index, pinned,
// selected, status, width, windowId
//
// May also want to include date, time, browser info, etc...
var parameters = [
    {
        key: 'date',
        value: function(tab) {
            d = new Date(); // TODO: some parameter should be calculated only once (not per tab)
            return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
        }
    },
    {
        key: 'time',
        value: function(tab) {
            d = new Date(); // TODO: some parameter should be calculated only once (not per tab)
            return d.getHours()+':'+d.getMinutes();
        }
    },
    {
        key: 'title',
        value: function(tab) {
            return tab.title;
        }
    },
    {
        key: 'url',
        value: function(tab) {
            return tab.url;
        }
    }
];

var examples = [
    {
        name: "(default)",
        formatString: "{title}\n{url}"
    },{
        name: "HTML",
        formatString: "<a href='{url}'>{title}</a>"
    },{
        name: "Markdown",
        formatString: "[{title}]({url})"
    },
    {
        name: "Org-mode (basic)",
        formatString: "[[{url}][{title}]]"
    },
    {
        name: "Org-mode (more advanced)",
        formatString: "* [[{url}][{title}]]\nCREATED: [{date} {time}]"
    }];
