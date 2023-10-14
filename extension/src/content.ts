// Function to log a message to the popup.
function logToPopup(message: string) {
    chrome.runtime.sendMessage({ action: "log", message });
  }
  
  // Function to remove popups and monitor events when the extension is enabled.
  function remover() {
    // Find popups and play button on the page.
    const popups: NodeListOf<HTMLElement> = document.querySelectorAll("ytd-popup-container");
    const popupArray = Array.from(popups);
    const playButton: HTMLElement | null = document.querySelector("ytp-play-button");
  
    // Check if the play button is paused and click it if needed.
    if (playButton) {
      const playButtonState: string | null = playButton.getAttribute("data-title-no-tooltip");
      const isPaused: boolean = playButtonState === "Play";
  
      if (isPaused) {
        logToPopup("Button was paused. Clicking...");
        playButton.click();
      }
  
      // Log if no popups are found and exit.
      if (popups.length === 0) {
        logToPopup("No popups found. Exiting...");
        return;
      }
  
      logToPopup(`Found ${popups.length} popup${popups.length === 1 ? "." : "s."}`);
  
      // Remove popups and log the removal.
      for (const popup of popupArray) {
        logToPopup("Removed popup... 👇");
        logToPopup(popup.toString());
        popup.remove();
      }
  
      logToPopup("Popup cleanup finished!");
      logToPopup("Event monitoring started!");
    }
  
    // Check if the extension is enabled from user preferences.
    chrome.storage.local.get(["extensionEnabled"], (result) => {
      const extensionEnabled = result.extensionEnabled;
  
      if (extensionEnabled) {
        // Attach a MutationObserver to the title element to monitor events.
        const titleElement: HTMLTitleElement | null = document.querySelector("title");
        const observer = new MutationObserver(() => {
          logToPopup("Event detected on the page. Searching for popups...");
          remover();
        });
  
        if (titleElement) {
          observer.observe(titleElement, {
            subtree: true,
            characterData: true,
            childList: true,
          });
        }
      } else {
        logToPopup("Extension is disabled.");
      }
    });
  
    // Check if the user wants to show logs and log it if enabled.
    chrome.storage.local.get(["showLogs"], (result) => {
      const showLogs = result.showLogs;
      if (showLogs) {
        logToPopup("Logging is enabled.");
      }
    });
  }
  