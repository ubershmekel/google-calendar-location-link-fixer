// --- File 2: content.js ---
// This script is injected into Google Calendar to modify the DOM.
// It uses a MutationObserver to detect the event details popup.

// A MutationObserver is used to watch for changes in the DOM.
// This is necessary because the event details popup is dynamically added.
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // We only care about new nodes being added.
    if (mutation.addedNodes.length > 0) {
      // Find all elements that might be a location link.
      // The selector 'div[data-chip-type="LOCATION"]' is a good starting point,
      // but it might need to be adjusted if Google's UI changes.
      document.querySelectorAll("div[data-text]").forEach((div) => {
        // Look for a span with "Location:" text inside this div
        const span = Array.from(div.querySelectorAll("span")).find(
          (s) => s.textContent && s.textContent.includes("Location:")
        );
        if (span) {
          const locationText = div.getAttribute("data-text");
          if (locationText && !div.querySelector("a")) {
            const link = document.createElement("a");
            link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              locationText
            )}`;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = locationText;
            div.innerHTML = "";
            div.appendChild(link);
          }
        }
      });
    }
  });
});

// Start observing the document body for changes.
observer.observe(document.body, { childList: true, subtree: true });
