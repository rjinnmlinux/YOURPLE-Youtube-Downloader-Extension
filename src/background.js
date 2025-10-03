// YOURPLE - Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  // Ready for future functionality or analytics
  console.log('YOURPLE installed.');
});
// Download trigger (future extension)
// Listen for download requests from popup/content scripts
chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg.action === 'downloadVideo' && msg.url) {
    chrome.downloads.download({
      url: msg.url,
      filename: `${msg.filename}.${msg.format || 'mp4'}`
    });
    respond({success: true});
  }
});
