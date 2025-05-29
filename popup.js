document.addEventListener('DOMContentLoaded', restoreSettings);
document.getElementById('saveSettings').addEventListener('click', saveSettings);

function restoreSettings() {
  chrome.storage.sync.get(['searchEngineUrl', 'additionalOptions'], function(items) {
    if (items.searchEngineUrl) {
      document.getElementById('searchEngineUrl').value = items.searchEngineUrl;
    }
    if (items.additionalOptions) {
      document.getElementById('additionalOptions').value = items.additionalOptions;
    }
  });
}

function saveSettings() {
  const searchEngineUrl = document.getElementById('searchEngineUrl').value.trim();
  const additionalOptions = document.getElementById('additionalOptions').value.trim();
  const statusDiv = document.getElementById('status');

  // verifies search engine URL
  try {
    new URL(searchEngineUrl);
  } catch (e) {
    statusDiv.textContent = 'Error: Search engine URL is not valid.';
    statusDiv.className = 'error';
    return;
  }

  // slices / or ? if user writes / or ? character at the end of search engine URL
  let cleanedSearchEngineUrl = searchEngineUrl;
  if (cleanedSearchEngineUrl.endsWith('/') || cleanedSearchEngineUrl.endsWith('?')) {
    cleanedSearchEngineUrl = cleanedSearchEngineUrl.slice(0, -1);
  }

  chrome.storage.sync.set({
    searchEngineUrl: cleanedSearchEngineUrl,
    additionalOptions: additionalOptions
  }, function() {
    statusDiv.textContent = 'Settings saved!';
    statusDiv.className = 'success';
    // notifies background script for rules updating
    chrome.runtime.sendMessage({ action: "updateRules" });
  });
}