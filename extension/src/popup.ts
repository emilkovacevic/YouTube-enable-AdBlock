document.addEventListener("DOMContentLoaded", async () => {
  const toggleButton = document.getElementById(
    "toggle-extension"
  ) as HTMLButtonElement;
  const toggleLogsButton = document.getElementById(
    "toggle-logs"
  ) as HTMLButtonElement;
  const consoleLogElement = document.getElementById(
    "console-log"
  ) as HTMLElement;

  let isExtensionEnabled = false;
  let isLoggingEnabled = false;
  let messages:string[] = [];

  if (!toggleButton || !toggleLogsButton || !consoleLogElement) {
    throw new Error("Loading Error");
  }

  function updateButtonState(enabled: boolean, button: HTMLButtonElement) {
    const buttonText = enabled ? "Enabled" : "Disabled";
    button.innerText = buttonText;
  }

  function updateLogsText(isLoggingEnabled: boolean) {
    consoleLogElement.style.display = isLoggingEnabled ? "block" : "none";
  }

  function sendmsgToContetn(s: string) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, s);
    });
  }

  function displayMessagesWithDelay(messages: string[]) {
    if (messages.length > 0) {
      let i = 0;
      
      function displayNextMessage() {
        if (i < messages.length) {
          consoleLogElement.innerText = messages[i];
          i++;
          setTimeout(displayNextMessage, 1500);
        }
      }
      
      displayNextMessage();
    }
  }

  toggleButton.addEventListener("click", () => {
    isExtensionEnabled = !isExtensionEnabled;
    chrome.storage.local.set({ extensionEnabled: isExtensionEnabled }, () => {
      updateButtonState(isExtensionEnabled, toggleButton);
      sendmsgToContetn(isExtensionEnabled ? "on" : "off");
    });
  });

  toggleLogsButton.addEventListener("click", () => {
    isLoggingEnabled = !isLoggingEnabled;
    chrome.storage.local.set({ showLogs: isLoggingEnabled }, () => {
      updateButtonState(isLoggingEnabled, toggleLogsButton);
      updateLogsText(isLoggingEnabled);

      // Add this part to start or stop the interval when logging is enabled/disabled
      if (isLoggingEnabled) {
        messages.push("Extension starter");
        displayMessagesWithDelay(messages);
      } else {
        messages.push("Extension stopped working");
        displayMessagesWithDelay(messages);
      }
    });
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.log) {
      messages.push(message.log);
      displayMessagesWithDelay(messages);
    }
  });

  chrome.storage.local.get(["extensionEnabled", "showLogs"], (result) => {
    isExtensionEnabled = result.extensionEnabled !== false;
    isLoggingEnabled = result.showLogs !== false;

    updateButtonState(isExtensionEnabled, toggleButton);
    updateButtonState(isLoggingEnabled, toggleLogsButton);
    updateLogsText(isLoggingEnabled);
  });

});
