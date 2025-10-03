// YOURPLE Popup.js: YouTube Downloader

document.addEventListener('DOMContentLoaded', () => {
  const videoTitleElem = document.getElementById('videoTitle');
  const channelElem = document.getElementById('channel');
  const thumbnailElem = document.getElementById('thumbnail');
  const qualitiesElem = document.getElementById('qualities');
  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const errorElem = document.getElementById('error');

  let currentVideo = null;

  function showError(msg) {
    errorElem.textContent = msg;
    errorElem.classList.remove('hidden');
    setTimeout(() => {
      errorElem.classList.add('hidden');
    }, 4000);
  }

  function updateDownloadProgress(percent) {
    progressBar.style.width = percent + '%';
    progressText.textContent = 'Download progress: ' + percent + '%';
  }

  function initiateDownload(quality, type) {
    progressContainer.classList.remove('hidden');
    progressText.textContent = 'Preparing download...';
    progressBar.style.width = '0%';

    chrome.runtime.sendMessage({
      action: 'downloadVideo',
      url: quality.url,
      format: type === 'audio' ? 'mp3' : 'mp4',
      filename: currentVideo.title.replace(/[\\\/:*?"<>|]/g, "") + '_' + quality.label
    }, response => {
      if (response && response.success) {
        updateDownloadProgress(100);
        progressText.textContent = 'Download started!';
        setTimeout(() => {
          progressContainer.classList.add('hidden');
        }, 2000);
      } else {
        showError('Download failed: ' + (response.error || 'Unknown error'));
      }
    });
  }

  function renderQualities(videoQualities = []) {
    qualitiesElem.innerHTML = '';
    if (!videoQualities.length) {
      qualitiesElem.innerHTML = '<div>No downloadable qualities found.</div>';
      return;
    }
    videoQualities.forEach(quality => {
      const btn = document.createElement('button');
      btn.textContent = `${quality.label} ${quality.fileSize ? ' - ' + quality.fileSize : ''}`;
      btn.className = 'quality-btn';
      btn.addEventListener('click', () => initiateDownload(quality, 'video'));
      qualitiesElem.appendChild(btn);
    });
    // For audio only, add MP3 option if available later
    /*
    if (videoQualities.length && videoQualities[0].audioUrl) {
      const abtn = document.createElement('button');
      abtn.textContent = 'Download MP3 (audio only)';
      abtn.className = 'quality-btn audio-btn';
      abtn.addEventListener('click', () => initiateDownload(videoQualities[0], 'audio'));
      qualitiesElem.appendChild(abtn);
    }
    */
  }

  function renderInfo(info) {
    videoTitleElem.textContent = info.title;
    channelElem.textContent = info.channelName;
    thumbnailElem.src = info.thumbnail;
    currentVideo = info;
    renderQualities(info.videoQualities);
  }

  // Get video info from content script
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    if (!tabs.length) {
      showError('Cannot detect YouTube tab.');
      return;
    }
    chrome.tabs.sendMessage(tabs[0].id, {action: 'getVideoInfo'}, response => {
      if (!response || !response.videoInfo) {
        showError('Failed to get video info. Make sure you are on a YouTube video page.');
        return;
      }
      renderInfo(response.videoInfo);
    });
  });
});
