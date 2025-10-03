// YOURPLE - Content Script for YouTube Video Info Extraction
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === 'getVideoInfo') {
    let videoTitle = document.title;
    let videoId = window.location.search.match(/v=([^&]+)/)?.[1] || window.location.pathname.split('/').pop();
    // Extract video links (basic fallback)
    let formats = [];
    const scripts = Array.from(document.querySelectorAll('script'))
      .map(s => s.textContent)
      .join('\n');
    const playerResponseMatch = scripts.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});/);
    if (playerResponseMatch) {
      try {
        const playerResponse = JSON.parse(playerResponseMatch[1]);
        if (playerResponse.streamingData && playerResponse.streamingData.formats) {
          formats = playerResponse.streamingData.formats.map(f => ({
            label: `${f.qualityLabel}`,
            url: f.url,
            fileSize: f.contentLength ? `${Math.round(f.contentLength/1048576)} MB` : "",
            id: f.itag
          }));
        }
      } catch (e) { /* fallback */ }
    }
    sendResponse({
      videoInfo: {
        id: videoId,
        title: videoTitle,
        url: window.location.href,
        channelName: document.querySelector('#text .ytd-channel-name, .ytd-channel-name#text')?.textContent || '',
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        duration: 0,
        videoQualities: formats,
        audioQualities: [] // Fill with mp3 support if needed
      }
    });
    return true;
  }
  if (req.action === 'downloadVideo') {
    sendResponse({success: false, error: 'Direct download not available from content script.'});
    return true;
  }
});
