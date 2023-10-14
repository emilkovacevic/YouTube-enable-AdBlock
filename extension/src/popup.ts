document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById(
    "toggle-extension"
  ) as HTMLButtonElement;
  const toggleLogsButton = document.getElementById(
    "toggle-logs"
  ) as HTMLButtonElement;
  const consoleLogElement = document.getElementById(
    "console-log"
  ) as HTMLElement;
  const removeCountElement = document.getElementById(
    "remove-count"
  ) as HTMLElement;

  const titleElement = document.querySelector("title");
  let isExtensionEnabled = true;
  let isLoggingEnabled = false;

  if (
    !toggleButton ||
    !toggleLogsButton ||
    !consoleLogElement ||
    !removeCountElement
  ) {
    consoleLogElement.textContent = "Loading error";
  }

  function remover() {
    const popups =
      (document.getElementsByClassName(
        "ytd-popup-container"
      ) as HTMLCollectionOf<Element>) || null;
    const playButton =
      (document.querySelector("ytp-play-button") as HTMLElement) || null;

    if (playButton) {
      const playButtonState = playButton.getAttribute("data-title-no-tooltip");
      const isPaused = playButtonState === "Play";

      if (isPaused) {
        consoleLogElement.textContent = "Button was paused. Clicking...";
        playButton.click();
      }
    }

    if (popups.length === 0) {
      consoleLogElement.textContent = "%cNo popups found. Exiting...";
      return;
    }

    consoleLogElement.textContent = `Found ${popups.length} popups`;

    for (const popup of popups) {
      consoleLogElement.textContent = "Removed popup...";
      consoleLogElement.textContent = popup.toString();
      popup.remove();
    }

    // debug message
    consoleLogElement.textContent = "Popup cleanup finished!";
    consoleLogElement.textContent = "Event monitoring started...";
  }

  if (!titleElement) {
    consoleLogElement.textContent = "No changes to title";
    return;
  }

  function createObserver() {
    return new MutationObserver(() => {
      consoleLogElement.textContent =
        "Event detected on the page. Searching for popups...";
      remover();
    });
  }

  let observer;

  function startObserver() {
    if (isExtensionEnabled && titleElement) {
      observer = createObserver();
      observer.observe(titleElement, {
        subtree: true,
        characterData: true,
        childList: true,
      });
    }
  }

  startObserver();

  function updateButtonState(enabled: boolean, button: HTMLButtonElement) {
    const buttonText = enabled ? "Enabled" : "Disabled";
    button.innerText = buttonText;
  }

  function updateLogsText(isLoggingEnabled: boolean) {
    if (isLoggingEnabled) {
      consoleLogElement.style.display = "block";
      consoleLogElement.textContent =
        "Logging is enabled. Logs will be shown here.";
    } else {
      consoleLogElement.style.display = "none";
    }
  }

  toggleButton.addEventListener("click", () => {
    chrome.storage.local.get(["extensionEnabled"], (result) => {
      isExtensionEnabled = result.extensionEnabled !== false;
      isExtensionEnabled = !isExtensionEnabled;
      chrome.storage.local.set({ extensionEnabled: isExtensionEnabled }, () => {
        updateButtonState(isExtensionEnabled, toggleButton);
      });
    });
  });

  toggleLogsButton.addEventListener("click", () => {
    chrome.storage.local.get(["showLogs"], (result) => {
      isLoggingEnabled = result.showLogs !== false;
      isLoggingEnabled = !isLoggingEnabled;
      chrome.storage.local.set({ showLogs: isLoggingEnabled }, () => {
        updateButtonState(isLoggingEnabled, toggleLogsButton);
        updateLogsText(isLoggingEnabled);
      });
    });
  });

  chrome.storage.local.get(
    ["extensionEnabled", "showLogs", "removeCount"],
    (result) => {
      isExtensionEnabled = result.extensionEnabled !== false;
      isLoggingEnabled = result.showLogs !== false;

      updateButtonState(isExtensionEnabled, toggleButton);
      updateButtonState(isLoggingEnabled, toggleLogsButton);
      updateLogsText(isLoggingEnabled);

      removeCountElement.textContent = `Removed Popups: ${
        result.removeCount || 0
      }`;
    }
  );
});
