(function(doc) {
    var allowClickProcessing = true,
        clickCount = 0,
        tabCount = 0;

    var clickTimer = null,
        tooltipTimer = null,
        iconTimer = null;

    var b = doc.getElementById('b');

    chrome.contextMenus.create({
        title: 'Copy',
        contexts: ['link', 'page'],
        onclick: function(info, t) {
            allowClickProcessing = false;
            copyWots(info.linkUrl ? [{
                url: info.linkUrl,
                highlighted: true
            }] : [t], 1, t)
        }
    });

    chrome.tabs.onUpdated.addListener(function(tabId/*, changeInfo, tab*/) {
        chrome.pageAction.show(tabId);
    });

    chrome.pageAction.onClicked.addListener(function(t) {
        if (allowClickProcessing) {
            //        notifyRunning(t);

            clearTimeout(clickTimer);

            clickCount++;

            clickTimer = setTimeout(copyTabs, clickCount > 2 ? 0 : 300, t, clickCount);
        }
    });

    function copyTabs(t, clicks) {
        allowClickProcessing = false;

        //chrome.pageAction.hide(t.id);

        //console.log(clickCount);

        if (t) {
            try {
                if (clicks > 2) {
                    chrome.windows.getAll({
                        populate: true
                    }, function(wots) {
                        copyWots(wots, clicks, t);
                    });
                } else {
                    chrome.tabs.getAllInWindow(null, function(wots) {
                        copyWots(wots, clicks, t);
                    });
                }
            } catch (err) {
                notifyError(t);
            }
        } else {
            notifyError(t);
        }
    }

    function copyWots(wots, clicks, t) {
        buffer_clear();

        var wot;
        for (var i = 0; i < wots.length; i++) {
            wot = wots[i];
            if (wot.tabs) { // window
                for (var j = 0; j < wot.tabs.length; j++) {
                    buffer_appendTabInfo(wot.tabs[j]);
                }
            } else { // tab
                if (wot.highlighted && clicks === 1 || clicks === 2) {
                    buffer_appendTabInfo(wot);
                }
            }
        }

        if (get('tab-format') === 'json') {
            b.value = '[' + b.value + ']';
        }

        if (buffer_copyToClipboard()) {
            notifyOK(t, clicks);
        } else {
            notifyError(t);
        }
    }

    function buffer_clear() {
        b.value = '';
        tabCount = 0;
    }

    function buffer_copyToClipboard() {
        if (b.value.length > 0) {
            b.select();
            doc.execCommand('copy');
            return true;
        }
    }

    function buffer_appendTabInfo(t) {
        if (b.value.length) {
            b.value += tabSeparator();
        }

        b.value += tabText(t);
        tabCount++;
    }

    function tabSeparator() {
        switch (get('tab-format')) {

            case 'txt2Lines':

                return '\n\n';

            case 'json':

                return ',\n';

        }

        return '\n';
    }

    // function notifyRunning(t) {
    //     chrome.pageAction.setIcon({
    //         tabId: t.id,
    //         path: 'img/icon19.png'
    //     });
    // }

    function notifyOK(t, inType) {
        if (!t.id) {
            return;
        }

        clearTimeout(tooltipTimer);
        clearTimeout(iconTimer);

        clickCount = 0;
        allowClickProcessing = true;

        chrome.pageAction.setTitle({
            tabId: t.id,
            title: (inType === 1 ? 'Copied ' + tabCount + ' selected ' + (tabCount === 1 ? 'tab' : 'tabs') : (inType === 2 ? 'Copied ' + tabCount + ' window ' + (tabCount === 1 ? 'tab' : 'tabs') : 'Copied ' + tabCount + ' session ' + (tabCount === 1 ? 'tab' : 'tabs')))
        });
        tooltipTimer = setTimeout(chrome.pageAction.setTitle, 1000, {
            tabId: t.id,
            title: ''
        });

        chrome.pageAction.setIcon({
            tabId: t.id,
            path: 'img/icon19ok.png'
        });
        //chrome.pageAction.show(t.id);
        iconTimer = setTimeout(chrome.pageAction.setIcon, 1000, {
            tabId: t.id,
            path: "img/icon19.png"
        });
    }

    function notifyError(t) {
        if (!t.id) {
            return;
        }

        clickCount = 0;
        allowClickProcessing = true;

        chrome.pageAction.setIcon({
            tabId: t.id,
            path: 'img/icon19error.png'
        });
    }
}(document));
