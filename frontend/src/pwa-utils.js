// This file contains utility functions for PWA functionality

// Function to show a notification when new content is available
export function showUpdateNotification(registration) {
  // Create a notification or UI element to inform the user about the update
  const notification = document.createElement("div")
  notification.className = "update-notification"
  notification.innerHTML = `
    
  `

  document.body.appendChild(notification)

  // Add event listener to the update button
  document.getElementById("update-app").addEventListener("click", () => {
    if (registration && registration.waiting) {
      // Send a message to the service worker to skip waiting and activate the new version
      registration.waiting.postMessage({ type: "SKIP_WAITING" })
    }
    // Remove the notification
    notification.remove()
    // Reload the page to load the new version
    window.location.reload()
  })
}

// Function to check if the app is installed
export function isAppInstalled() {
  // Check if the app is in standalone mode or display-mode is standalone
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true
}

// Function to show install prompt
export function showInstallPrompt(deferredPrompt) {
  if (!deferredPrompt) return

  // Create a UI element to prompt the user to install the app
  const installPrompt = document.createElement("div")
  installPrompt.className = "install-prompt"
  installPrompt.innerHTML = `
    <div class="install-prompt-content">
      <p>Install VolunteerHub for a better experience!</p>
      <div class="install-buttons">
        <button id="install-app">Install</button>
        <button id="dismiss-install">Not now</button>
      </div>
    </div>
  `

  document.body.appendChild(installPrompt)

  // Add event listeners to the buttons
  document.getElementById("install-app").addEventListener("click", async () => {
    // Show the install prompt
    deferredPrompt.prompt()
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice
    // Remove the UI element regardless of the user's choice
    installPrompt.remove()
    // We no longer need the prompt. Clear it up
    deferredPrompt = null
  })

  document.getElementById("dismiss-install").addEventListener("click", () => {
    // Remove the UI element
    installPrompt.remove()
  })
}

// Add CSS for the notifications
const style = document.createElement("style")
style.textContent = `
  .update-notification, .install-prompt {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 16px;
    z-index: 1000;
    max-width: 90%;
    width: 400px;
  }
  
  .update-notification-content, .install-prompt-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .install-buttons {
    display: flex;
    gap: 12px;
    margin-top: 12px;
  }
  
  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }
  
  #update-app, #install-app {
    background-color: #4f46e5;
    color: white;
  }
  
  #dismiss-install {
    background-color: #e5e7eb;
    color: #374151;
  }
`

document.head.appendChild(style)
