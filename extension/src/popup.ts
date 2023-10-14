document.addEventListener("DOMContentLoaded", () => {
  // Get references to HTML elements by their IDs.
  const toggleButton = document.querySelector("#toggle-extension") as HTMLButtonElement;
  const consoleLogElement = document.querySelector("#console-log") as HTMLElement;
  const removeCountElement = document.querySelector("#remove-count") as HTMLElement;

  // Check if any of the required elements are missing and log an error.
  if (!toggleButton || !consoleLogElement || !removeCountElement) {
    console.log('Loading error');
  }

  // Function to append a message to the consoleLogElement.
  function logMessage(message: string) {
    consoleLogElement.textContent += message + "\n";
  }

  // Function to update the button text based on the extension state.
  function updateButtonState(enabled: boolean) {
    const buttonText = enabled ? "Enabled" : "Disabled";
    toggleButton.innerText = buttonText;
  }

  // Add a click event listener to the toggle button.
  toggleButton.addEventListener("click", () => {
    // Get the extensionEnabled value from local storage and toggle it.
    chrome.storage.local.get(["extensionEnabled"], (result) => {
      const extensionEnabled = result.extensionEnabled;
      const newExtensionState = !extensionEnabled;
      chrome.storage.local.set({ extensionEnabled: newExtensionState });
      // Update the button text based on the new extension state.
      updateButtonState(newExtensionState);
    });
  });

  // Listen for log messages from content scripts.
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "log") {
      logMessage(message.message);
    }
  });

  // Load user preferences from storage.
  chrome.storage.local.get(["extensionEnabled", "showLogs", "removeCount"], (result) => {
    const extensionEnabled = result.extensionEnabled;
    const showLogs = result.showLogs;
    const removeCount = result.removeCount || 0;

    // Update the button state, log if logging is enabled, and display the removed popups count.
    updateButtonState(extensionEnabled);

    if (showLogs) {
      logMessage("Logging is enabled.");
    }

    removeCountElement.textContent = `Removed Popups: ${removeCount}`;
  });
});
