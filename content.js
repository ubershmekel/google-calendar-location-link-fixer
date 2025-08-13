// A MutationObserver is used to watch for changes in the DOM.
// This is necessary because the event details popup is dynamically added.
let lastRun = new Date().getTime();
const observer = new MutationObserver((mutations) => {
  // limit to once per 200ms
  const now = new Date().getTime();
  if (now - lastRun < 200) return;
  lastRun = now;
  // We're looking for something like:
  // <div data-text="...">...<span>Location: ...</span>...</div>
  document.querySelectorAll("div[data-text]").forEach(processDiv);
});

function processDiv(dataDiv) {
  const span = Array.from(dataDiv.querySelectorAll("span")).find(
    (s) => s.textContent && s.textContent.includes("Location:")
  );
  if (span) {
    // setTimeout 100ms is used to ensure the DOM is fully updated because
    // Calendar was overwriting the changes sometimes.
    setTimeout(() => {
      const locationText = dataDiv.getAttribute("data-text");
      if (locationText && !dataDiv.querySelector("a")) {
        const link = document.createElement("a");
        link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          locationText
        )}`;

        // Open in a new  tab
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        // Show the user that this was updated to a regular link
        link.textContent = "🔗" + locationText;

        // Prevent the parent div onclick from happening so it won't open the sidebar
        link.addEventListener("click", function (e) {
          // Don't let the div's click handler run
          e.stopPropagation();
          // No preventDefault() so the link still opens
        });

        dataDiv.innerHTML = "";
        dataDiv.appendChild(link);
      }
    }, 100);
  }
}

// Start observing the document body for changes.
observer.observe(document.body, { childList: true, subtree: true });
