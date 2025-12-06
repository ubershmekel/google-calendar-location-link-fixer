// A MutationObserver is used to watch for changes in the DOM.
// This is necessary because the event details popup is dynamically added.
let lastRun = new Date().getTime();

const markerString = "gcllf-buttons-added";

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
  if (!span) return;

  // setTimeout 100ms is used to ensure the DOM is fully updated because
  // Calendar was overwriting the changes sometimes.
  setTimeout(() => {
    const locationText = dataDiv.getAttribute("data-text");
    if (!locationText || dataDiv.querySelector("." + markerString)) return;

    const encodedLocation = encodeURIComponent(locationText);
    const href = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;

    const locationTextEl = document.createElement("div");
    locationTextEl.textContent = locationText;

    const link = document.createElement("a");
    link.href = href;
    // Open in a new  tab
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    // Show the user that this was updated to a regular link
    link.textContent = locationText;
    // Prevent the parent div onclick from happening so it won't open the sidebar
    link.addEventListener("click", function (e) {
      e.stopPropagation();
      // No preventDefault() so the link still opens
    });

    const linkButton = document.createElement("button");
    linkButton.type = "button";
    linkButton.classList.add(markerString);
    linkButton.textContent = "↗️";
    linkButton.setAttribute("aria-label", "Open location in Google Maps");
    linkButton.style.marginRight = "0.35em";
    linkButton.style.cursor = "pointer";
    linkButton.addEventListener("click", function (e) {
      e.stopPropagation();
      window.open(href, "_blank");
    });

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.classList.add(markerString);
    copyButton.textContent = "📋";
    copyButton.setAttribute("aria-label", "Copy location to clipboard");
    copyButton.style.marginLeft = "0.35em";
    copyButton.style.cursor = "pointer";
    copyButton.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(locationText)
          .catch(() => fallbackCopy(locationText));
      } else {
        fallbackCopy(locationText);
      }
    });

    dataDiv.innerHTML = "";
    dataDiv.appendChild(locationTextEl);
    dataDiv.appendChild(linkButton);
    dataDiv.appendChild(copyButton);
    // dataDiv.appendChild(link);
  }, 100);
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

// Start observing the document body for changes.
observer.observe(document.body, { childList: true, subtree: true });
