// YOURPLE - Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('YOURPLE installed (background.js).');
});

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg.action === 'downloadVideo' && msg.url) {
    chrome.downloads.download({
      url: msg.url,
      filename: `${msg.filename || 'youtube'}.${msg.format || 'mp4'}`,
      saveAs: false
    }, downloadId => {
      if (downloadId) {
        respond({success: true});
      } else {
        respond({success: false, error: 'Download API failed (background.js)'});
      }
    });
    return true;
  }
});
