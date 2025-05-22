// This file handles the PWA installation process

// Variable to store the deferred prompt event
let deferredPrompt

// Function to show custom install button
function showInstallButton() {
  // Check if the button already exists
  if (document.getElementById("pwa-install-button")) {
    return
  }

  const installButton = document.createElement("div")
  installButton.id = "pwa-install-button"
  installButton.innerHTML = `
    <button id="install-pwa-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="install-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      Install App
    </button>
  `

  document.body.appendChild(installButton)

  // Add event listener to the install button
  document.getElementById("install-pwa-btn").addEventListener("click", async () => {
    if (!deferredPrompt) {
      // If deferredPrompt is not available, we'll try to provide alternative installation instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      const isAndroid = /Android/.test(navigator.userAgent)

      let message = "Installation is not available. "

      if (isIOS) {
        message += "To install on iOS: tap the share button and then 'Add to Home Screen'."
      } else if (isAndroid) {
        message += "To install on Android: tap the menu button and then 'Add to Home Screen' or 'Install App'."
      } else {
        message += "Make sure you're using a supported browser and not already have the app installed."
      }

      alert(message)
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)

    // We've used the prompt, and can't use it again, discard it
    deferredPrompt = null

    // Hide the install button
    document.getElementById("pwa-install-button").style.display = "none"
  })
}

// Function to manually trigger install for iOS devices
function showIOSInstallInstructions() {
  // Check if the prompt already exists
  if (document.getElementById("ios-install-prompt")) {
    return
  }

  const iosInstallPrompt = document.createElement("div")
  iosInstallPrompt.id = "ios-install-prompt"
  iosInstallPrompt.innerHTML = `
    <div class="ios-prompt">
      <button id="close-ios-prompt">×</button>
      <p>To install this app on your iOS device:</p>
      <ol>
        <li>Tap the Share button <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg></li>
        <li>Scroll down and tap "Add to Home Screen"</li>
        <li>Tap "Add" in the top right corner</li>
      </ol>
    </div>
  `

  document.body.appendChild(iosInstallPrompt)

  document.getElementById("close-ios-prompt").addEventListener("click", () => {
    document.getElementById("ios-install-prompt").remove()
  })

  // Add styles for iOS prompt
  const style = document.createElement("style")
  style.textContent += `
    #ios-install-prompt {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      width: 90%;
      max-width: 350px;
    }
    
    .ios-prompt {
      padding: 20px;
      position: relative;
    }
    
    #close-ios-prompt {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
    }
    
    .ios-prompt p {
      margin-top: 0;
      font-weight: 500;
    }
    
    .ios-prompt ol {
      padding-left: 20px;
    }
    
    .ios-prompt li {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  `

  document.head.appendChild(style)
}

// Function to initialize the PWA installation
export function initPwaInstall() {
  try {
    // Check if it's an iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

    if (isIOS) {
      // For iOS, we need to show custom instructions since beforeinstallprompt doesn't work
      // Only show if the app is not already installed (check for standalone mode)
      if (!window.navigator.standalone) {
        // Show iOS install instructions after a delay to not annoy users immediately
        setTimeout(() => {
          showIOSInstallInstructions()
        }, 5000) // 5 seconds delay
      }
    } else {
      // For other browsers, use the standard beforeinstallprompt event
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault()

        // Stash the event so it can be triggered later
        deferredPrompt = e

        // Show the install button
        showInstallButton()

        console.log("PWA install prompt is ready to be shown")
      })
    }

    // Listen for the appinstalled event
    window.addEventListener("appinstalled", (e) => {
      // Log install to analytics
      console.log("PWA was installed")

      // Hide the install button after successful installation
      if (document.getElementById("pwa-install-button")) {
        document.getElementById("pwa-install-button").style.display = "none"
      }

      // Hide iOS prompt if it exists
      if (document.getElementById("ios-install-prompt")) {
        document.getElementById("ios-install-prompt").remove()
      }

      // Clear the deferredPrompt
      deferredPrompt = null
    })

    // Add styles for the install button
    const style = document.createElement("style")
    style.textContent = `
      #pwa-install-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
      }
      
      #install-pwa-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: #4f46e5;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 16px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
      }
      
      .install-icon {
        width: 16px;
        height: 16px;
      }
      
      @media (max-width: 768px) {
        #pwa-install-button {
          bottom: 16px;
          right: 16px;
        }
      }
    `

    document.head.appendChild(style)
  } catch (error) {
    console.error("Error initializing PWA install:", error)
  }
}

// Function to check if the app is already installed
export function isAppInstalled() {
  // Check if the app is in standalone mode (installed)
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true

  // Check if it's running as a PWA
  const isPWA =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches

  return isStandalone || isPWA
}
