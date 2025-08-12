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
      const locationElements = document.querySelectorAll(
        'div[data-chip-type="LOCATION"]'
      );

      locationElements.forEach((element) => {
        // If the element already contains an anchor tag, it means we've already
        // processed it, so we can skip.
        if (element.querySelector("a")) {
          return;
        }

        const locationText = element.textContent.trim();
        if (locationText) {
          // Create a new anchor element.
          const link = document.createElement("a");
          link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            locationText
          )}`;
          link.target = "_blank"; // Opens in a new tab.
          link.rel = "noopener noreferrer"; // Security best practice.
          link.textContent = locationText;

          // Replace the original div's content with the new link.
          element.innerHTML = "";
          element.appendChild(link);
        }
      });
    }
  });
});

// Start observing the document body for changes.
observer.observe(document.body, { childList: true, subtree: true });
