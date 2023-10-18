chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("youtube.com")) {
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
    });
  }
});


