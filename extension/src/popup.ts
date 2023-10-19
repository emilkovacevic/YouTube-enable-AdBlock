import { getActiveTabURL } from './utils';

document.addEventListener("DOMContentLoaded", async() => {
  const activeTab = await getActiveTabURL();
  const toggleButton = document.getElementById("toggle-extension") as HTMLButtonElement;
  const toggleLogsButton = document.getElementById("toggle-logs") as HTMLButtonElement;
  const consoleLogElement = document.getElementById("console-log") as HTMLElement;

  let isExtensionEnabled = false;
  let isLoggingEnabled = false;
  let messages: string[] = [];

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

  function sendMsgToContent(message: string) {
    if (activeTab && activeTab.id) {
      chrome.tabs.sendMessage(activeTab.id, { contentScriptMessage: message });
    } else {
      consoleLogElement.innerText = 'Failed to send message to content script';
    }
  }


  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const logMessage = message.log;
    messages.push("Received log message:", logMessage);
  });

  function displayMessagesWithDelay(messages: string[]) {
    if (messages.length > 0) {
      let i = 0;

      function displayNextMessage() {
        if (i < messages.length) {
          consoleLogElement.innerText = messages[i];
          i++;
          setTimeout(displayNextMessage, 1000);
        }
      }

      displayNextMessage();
    }
  }

  // Enable or disable the extension
  toggleButton.addEventListener("click", () => {
    isExtensionEnabled = !isExtensionEnabled;
    chrome.storage.local.set({ extensionEnabled: isExtensionEnabled }, () => {
      updateButtonState(isExtensionEnabled, toggleButton);
      sendMsgToContent(isExtensionEnabled ? "on" : "off");
    });
  });

  // Enable or disable logging
  toggleLogsButton.addEventListener("click", () => {
    isLoggingEnabled = !isLoggingEnabled;
    chrome.storage.local.set({ showLogs: isLoggingEnabled }, () => {
      updateButtonState(isLoggingEnabled, toggleLogsButton);
      updateLogsText(isLoggingEnabled);
      if (isLoggingEnabled) {
        displayMessagesWithDelay(messages);
      }
    });
  });

function load(){
  try {
    if (!activeTab.active) {
      // Handle the case where there's no active tab
      updateButtonState(false, toggleButton);
      updateButtonState(false, toggleLogsButton);
      consoleLogElement.innerText = 'Not a youtube page'
      sendMsgToContent('off')
      return false
    } else if(isExtensionEnabled) {
      const queryParameters = activeTab.url!.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      const currentVideo = urlParameters.get("v");
      if (activeTab.url!.includes("youtube.com/watch") && currentVideo) {
        sendMsgToContent('on')
        clearInterval(intervalID);
        return true
      }
      else{
        consoleLogElement.innerText = 'Not a youtube watch video page'
        sendMsgToContent('off')
        clearInterval(intervalID);
        return true
      }
    }
    else{
      consoleLogElement.innerText = 'Disabled'
      sendMsgToContent('off')
      return false
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return false
  }
}

const intervalID = setInterval(function () {
  if (load()) {
    clearInterval(intervalID);
  }
}, 500);


  // Load extension state from storage
  chrome.storage.local.get(["extensionEnabled", "showLogs"], (result) => {
    isExtensionEnabled = result.extensionEnabled !== false;
    isLoggingEnabled = result.showLogs !== false;
  
    // Ensure the initial state of the buttons reflects the actual state
    updateButtonState(isExtensionEnabled, toggleButton);
    updateButtonState(isLoggingEnabled, toggleLogsButton);
    updateLogsText(isLoggingEnabled);
  });
});
