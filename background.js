if (localStorage["install1"] == undefined)
{
    chrome.tabs.create({url:'options.html'});
    localStorage["install1"] = "true";
}


chrome.browserAction.onClicked.addListener(function() {
    abreExtension(localStorage['extElegida']);
});


chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab) {
    var newTabExt = esTabNewTab(tabId);
    if (newTabExt != '') 
    {
        if (tab.url.indexOf('chrome') == -1)
        {
            quitaTab(tabId);
            if (newTabExt.extId && !newTabExt.extEnabled) chrome.management.setEnabled(newTabExt.extId, false);
        }
    }
})

chrome.tabs.onRemoved.addListener(function(tabId)
{
    var newTabExt = esTabNewTab(tabId);
    if (newTabExt != '') 
    {
        quitaTab(tabId);
        if (newTabExt.extId && !newTabExt.extEnabled) chrome.management.setEnabled(newTabExt.extId, false);
    }
});



chrome.management.onInstalled.addListener(function(extinfo){
    console.log(extinfo);
    if (esExtensionNewtab(extinfo.id))
    {
        var optionsUrl = chrome.extension.getURL('options.html');

        chrome.tabs.query({url: optionsUrl}, function(tabs) {
            if (tabs.length) {
                chrome.tabs.update(tabs[0].id, {active: true});
            } else {
                chrome.tabs.create({url: optionsUrl});
            }
        });
    }
});

