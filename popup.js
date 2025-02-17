document.addEventListener("DOMContentLoaded", () => {
  const exportButton = document.getElementById("export");
  if (!exportButton) {
    console.error("Export button not found in popup.html!");
    return;
  }

  exportButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"],
      });
    });
  });
});
