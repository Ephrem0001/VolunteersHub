// This file handles LAN IP detection and redirection for PWA installation

// Function to check if we're on a LAN IP
export function isLanIp() {
  const hostname = window.location.hostname

  // Check if we're on localhost
  if (
    hostname === "localhost" ||
    hostname === "[::1]" ||
    hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  ) {
    return false
  }

  // Check if we're on a private IP range (LAN)
  // 10.0.0.0 - 10.255.255.255
  // 172.16.0.0 - 172.31.255.255
  // 192.168.0.0 - 192.168.255.255
  const ipParts = hostname.split(".")
  if (ipParts.length === 4) {
    const firstOctet = Number.parseInt(ipParts[0], 10)
    const secondOctet = Number.parseInt(ipParts[1], 10)

    if (
      firstOctet === 10 ||
      (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) ||
      (firstOctet === 192 && secondOctet === 168)
    ) {
      return true
    }
  }

  return false
}

// Function to show LAN installation instructions
export function showLanInstallInstructions() {
  // Create a button to show installation instructions
  const lanInstallButton = document.createElement("div")
  lanInstallButton.id = "lan-install-button"
  lanInstallButton.innerHTML = `
    <button id="lan-install-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="install-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      Install App
    </button>
  `

  document.body.appendChild(lanInstallButton)

  // Add event listener to open installation instructions
  document.getElementById("lan-install-btn").addEventListener("click", () => {
    window.open("/lan-install.html", "_blank")
  })

  // Add styles for the LAN install button
  const style = document.createElement("style")
  style.textContent = `
    #lan-install-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
    }
    
    #lan-install-btn {
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
  `

  document.head.appendChild(style)
}

// Initialize LAN detection
export function initLanDetection() {
  if (isLanIp()) {
    // We're on a LAN IP, show installation instructions
    window.addEventListener("load", () => {
      showLanInstallInstructions()
    })

    console.log("LAN IP detected. Using manual PWA installation instructions.")
    return true
  }

  return false
}
