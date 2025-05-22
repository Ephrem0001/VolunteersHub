import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import { initPwaInstall } from "./pwa-install"
import { initLanDetection } from "./lan-detection"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Check if we're on a LAN IP
const isOnLan = initLanDetection()

// Register the service worker for PWA functionality
// But only if we're not on a LAN IP in development
if (!isOnLan || process.env.NODE_ENV === "production") {
  serviceWorkerRegistration.register({
    onUpdate: (registration) => {
      // When a new version is available, show an update notification
      if (registration) {
        const updateButton = document.createElement("div")
        updateButton.id = "pwa-update-button"
        updateButton.innerHTML = `
          <div class="update-notification">
            <p>New version available!</p>
            <button id="update-pwa-btn">Update Now</button>
          </div>
        `

        document.body.appendChild(updateButton)

        document.getElementById("update-pwa-btn").addEventListener("click", () => {
          if (registration && registration.waiting) {
            // Send a message to the waiting service worker to activate
            registration.waiting.postMessage({ type: "SKIP_WAITING" })
            updateButton.remove()
          }
        })
      }
    },
  })

  // Initialize the PWA install functionality
  // This will show the install button when appropriate
  window.addEventListener("load", () => {
    // Check if we're on localhost or a secure context
    const isLocalhost = Boolean(
      window.location.hostname === "localhost" ||
        window.location.hostname === "[::1]" ||
        window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
    )

    const isSecureContext = window.isSecureContext || isLocalhost

    // Only initialize PWA install on secure contexts or localhost
    if (isSecureContext) {
      initPwaInstall()
    }
  })
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

// Add styles for the update notification
const style = document.createElement("style")
style.textContent = `
  .update-notification {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background-color: #4f46e5;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .update-notification p {
    margin: 0;
  }
  
  #update-pwa-btn {
    background-color: white;
    color: #4f46e5;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-weight: 500;
    cursor: pointer;
  }
`

document.head.appendChild(style)
