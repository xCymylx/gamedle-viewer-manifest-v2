// Enable/disable button based on Gamedle domain
function updateButton(tabId) {
    browser.tabs.get(tabId).then(tab => {
      const isGamedle = tab.url && (
        tab.url.includes('gamedle.wtf') ||
        tab.url.includes('www.gamedle.wtf')
      );
      
      if (isGamedle) {
        browser.browserAction.enable(tabId);
      } else {
        browser.browserAction.disable(tabId); 
      }
    });
  }
  
  // Set up listeners
  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.url) updateButton(tabId);
  });
  
  browser.tabs.onActivated.addListener(activeInfo => {
    updateButton(activeInfo.tabId);
  });
  
  // Initialize
  browser.tabs.query({active: true, currentWindow: true})
    .then(tabs => tabs[0] && updateButton(tabs[0].id));