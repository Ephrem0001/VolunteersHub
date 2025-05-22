// This file contains helper functions for PWA development in HTTP environments

// Function to check if we're in a development environment
export function isDevelopment() {
  return (
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  )
}

// Function to manually register the service worker in development
export function registerDevServiceWorker() {
  if ("serviceWorker" in navigator && isDevelopment()) {
    console.log("Attempting to register service worker in development mode...")

    // Force registration even on HTTP
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered successfully in development mode:", registration)
      })
      .catch((error) => {
        console.error("Service Worker registration failed in development mode:", error)

        // Show developer guidance
        console.info(
          "PWA Development Tips:\n" +
            '1. For Chrome: Enable "Bypass for network" in Service Worker section of DevTools Application tab\n' +
            '2. For Firefox: Visit about:config and set "dom.serviceWorkers.testing.enabled" to true\n' +
            "3. Try using localhost instead of 127.0.0.1\n" +
            "4. Clear site data and try again",
        )
      })
  }
}

// Function to simulate the install prompt for development
export function simulateInstallPrompt() {
  if (isDevelopment()) {
    console.log("Simulating install prompt for development...")

    const installButton = document.createElement("div")
    installButton.id = "dev-install-button"
    installButton.innerHTML = `
      <button id="dev-install-btn">
        <span style="font-size: 10px;">[DEV]</span> Simulate Install
      </button>
    `

    document.body.appendChild(installButton)

    document.getElementById("dev-install-btn").addEventListener("click", () => {
      alert(
        "This is a simulated install prompt for development.\n\nIn production, this would trigger the actual browser install prompt.",
      )

      // Show device-specific instructions
      const userAgent = navigator.userAgent.toLowerCase()
      if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
        alert(
          'iOS Install Instructions:\n\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right corner',
        )
      } else if (userAgent.includes("android")) {
        alert(
          'Android Install Instructions:\n\n1. Tap the menu button (⋮)\n2. Tap "Add to Home screen" or "Install App"',
        )
      } else {
        alert(
          "Desktop Install Instructions:\n\n1. Look for the install icon in the address bar\n2. Click it and follow the prompts",
        )
      }
    })

    // Add styles for the dev install button
    const style = document.createElement("style")
    style.textContent = `
      #dev-install-button {
        position: fixed;
        bottom: 80px;
        right: 20px;
        z-index: 9999;
      }
      
      #dev-install-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: #f97316;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 16px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
      }
    `

    document.head.appendChild(style)
  }
}
