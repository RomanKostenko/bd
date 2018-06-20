// Activate extension button for every site with ch suffix (Will work on preprod, prod or in sandbox
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {hostSuffix: 'ch'}
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {hostSuffix: 'docker'}
                })
            ],
            // Activate extension button
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});