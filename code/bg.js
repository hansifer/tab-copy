(function(doc) {
    var allowClickProcessing = true,
        clickCount = 0;

    var clickTimer = null,
        tooltipTimer = null,
        iconTimer = null;

    var b = doc.getElementById('b');

    chrome.contextMenus.create({
        title: 'Copy tab',
        // contexts: ['link', 'page'],
        contexts: ['all'],
        onclick: function(info, t) {
            allowClickProcessing = false;
            copyWots(
                /*info.linkUrl ? [{
                                url: info.linkUrl,
                                highlighted: true
                            }] :*/
                [t], 1, t);
        }
    });

    // provide suggested value(s) if none specified
    if (localStorage.getItem('custom-start') == null) {
        localStorage.setItem('custom-start', '[date]\\n\\n');
    }

    chrome.tabs.onUpdated.addListener(function(tid /*, changeInfo, tab*/ ) {
        chrome.pageAction.show(tid);
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
        tabsText(wots, clicks, get('format'), function(s, tabCount) {
            if (copyToClipboard(s)) {
                notifyOK(t, clicks, tabCount);
            } else {
                notifyError(t);
            }
        });
    }

    function copyToClipboard(txt) {
        if (txt.length > 0) {
            b.value = txt;
            b.select();
            doc.execCommand('copy');
            return true;
        }
    }

    // function notifyRunning(t) {
    //     chrome.pageAction.setIcon({
    //         tabId: t.id,
    //         path: 'img/icon19.png'
    //     });
    // }

    function notifyOK(t, inType, tabCount) {
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
            path: 'img/icon19.png'
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
