// YOURPLE - Content Script for YouTube Video Info Extraction
// This runs in the context of YouTube pages
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === 'getVideoInfo') {
    let videoTitle = document.title;
    let videoId = window.location.search.match(/v=([^&]+)/)?.[1] || window.location.pathname.split('/').pop();
    sendResponse({
      videoInfo: {
        id: videoId,
        title: videoTitle,
        url: window.location.href,
        channelName: document.querySelector('#text .ytd-channel-name, .ytd-channel-name#text')?.textContent || '',
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        duration: 0 // duration detection would require deeper parsing
      }
    });
  }
  // Add more extraction functions as needed...
  return true;
});
