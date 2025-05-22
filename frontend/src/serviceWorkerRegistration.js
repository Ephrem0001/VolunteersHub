// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
)

export function register(config) {
  // First, check if service workers are supported
  if (!("serviceWorker" in navigator)) {
    console.log("Service workers are not supported in this browser")
    return
  }

  // Check if we're in a development environment
  const isDev = process.env.NODE_ENV === "development"

  // Determine if we should register the service worker
  const shouldRegister =
    // Always register in production if service workers are supported
    process.env.NODE_ENV === "production" ||
    // In development, only register on localhost
    (isDev && isLocalhost)

  if (shouldRegister) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL || "", window.location.href)
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return
    }

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL || ""}/service-worker.js`

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config)

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            "This web app is being served cache-first by a service " +
              "worker. To learn more, visit https://cra.link/PWA",
          )
        })
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config)
      }
    })

    // Handle service worker updates
    if (navigator.serviceWorker) {
      let refreshing = false
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return
        refreshing = true
        window.location.reload()
      })
    }
  } else {
    // We're in development on a non-localhost address (like a LAN IP)
    console.log("Service Worker registration skipped: Not on localhost in development mode")

    // Show a message about PWA limitations on LAN IPs
    if (isDev && !isLocalhost) {
      console.info(
        "PWA features are limited when accessing via LAN IP in development.\n" +
          "For full PWA functionality in development, use localhost or deploy with HTTPS.",
      )

      // Initialize manual install button for LAN testing
      window.addEventListener("load", () => {
        initManualInstallButton()
      })
    }
  }
}

// Function to show a manual install button for LAN testing
function initManualInstallButton() {
  const installButton = document.createElement("div")
  installButton.id = "manual-install-button"
  installButton.innerHTML = `
    <button id="manual-install-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="install-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      Install App (LAN Mode)
    </button>
  `

  document.body.appendChild(installButton)

  // Add event listener to the install button
  document.getElementById("manual-install-btn").addEventListener("click", () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    const isAndroid = /Android/.test(navigator.userAgent)

    if (isIOS) {
      alert(
        'To install on iOS:\n\n1. Tap the share button (rectangle with arrow)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right corner',
      )
    } else if (isAndroid) {
      alert(
        'To install on Android:\n\n1. Tap the menu button (⋮)\n2. Tap "Install app" or "Add to Home screen"\n3. Follow the on-screen instructions',
      )
    } else {
      alert(
        "To install on desktop:\n\n1. When testing PWAs over LAN, you need to use HTTPS for automatic installation.\n2. For development, use localhost instead of IP address for better PWA support.",
      )
    }
  })

  // Add styles for the manual install button
  const style = document.createElement("style")
  style.textContent = `
    #manual-install-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
    }
    
    #manual-install-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: #f59e0b;
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
  `

  document.head.appendChild(style)
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log("Service Worker registered successfully")
      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (installingWorker == null) {
          return
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                "New content is available and will be used when all " +
                  "tabs for this page are closed. See https://cra.link/PWA.",
              )

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration)
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log("Content is cached for offline use.")

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration)
              }
            }
          }
        }
      }
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error)
    })
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get("content-type")
      if (response.status === 404 || (contentType != null && contentType.indexOf("javascript") === -1)) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload()
          })
        })
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config)
      }
    })
    .catch(() => {
      console.log("No internet connection found. App is running in offline mode.")
    })
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error(error.message)
      })
  }
}
