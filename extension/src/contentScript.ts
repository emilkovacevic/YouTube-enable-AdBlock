(() => {
  let isExtensionEnabled = false;
  let observer;

  function reset() {
    observer = null;
  }

  function sendMessage(message: string) {
    chrome.runtime.sendMessage({ log: message });
    console.log(message);
  }

  function catchPopup() {
    if (!isExtensionEnabled) return;

    const youtubePopups = document.querySelectorAll("ytd-popup-container");
    const playButton = document.querySelector(".ytp-play-button") as HTMLElement;

    if (playButton) {
      const playButtonState = playButton.getAttribute("data-title-no-tooltip");
      const isPaused = playButtonState === "Play";

      if (isPaused) {
        sendMessage("Button was paused. Clicking...");
        playButton.click();
        sendMessage("Playing the video...");
      }
    }

    if (youtubePopups.length === 0) {
      sendMessage("No popups...");
      return;
    }

    sendMessage(
      `Found ${youtubePopups.length} popup${
        youtubePopups.length === 1 ? "." : "s."
      }`
    );

    youtubePopups.forEach((popup) => {
      sendMessage("Removed popup...");
      popup.remove();
    });

    sendMessage("Popup cleanup finished!");
    sendMessage("Event monitoring restarted!");

    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (
              node instanceof Element &&
              node.classList.contains("ytd-popup-container")
            ) {
              catchPopup();
            }
          });
        }
      });
    });

    if (isExtensionEnabled) {
      sendMessage("Listening to events");
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      sendMessage("Not listening to events");
      observer.disconnect();
    }
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.contentScriptMessage === "on") {
      isExtensionEnabled = true;
      sendMessage("Enabled true");
      catchPopup(); // Initialize and set up event listeners when enabled
    } else if (message.contentScriptMessage === "off") {
      isExtensionEnabled = false;
      reset();
      sendMessage("Enabled false");
    }
  });

  chrome.runtime.onMessage.addListener((obj) => {
    const { type } = obj;
    if (isExtensionEnabled) {
      if (type === "NEW") {
        sendMessage("New video loaded");
        catchPopup(); // Reinitialize event listeners for the new video
      }
    }
  });
})();
