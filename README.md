# Google Calendar Location Link Fixer

This Chrome extension automatically converts the location button Google Calendar
event popups into a clickable Google Maps link. It prevents the default sidebar
behavior and ensures the location opens directly in Google Maps.

## How it Works

- Uses a MutationObserver to watch for new event detail popups
- Locates the location field by searching for a `div[data-text]` with a child
  span containing "Location:"
- Replaces the location text with a Google Maps link using the value from the
  `data-text` attribute

## Installation (Development)

1. Download or clone this repository to your computer.
2. Go to `chrome://extensions` in your browser.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select this project folder.
5. Open Google Calendar and view an event to see the extension in action.
6. If you make changes to the `content.js` file, you can reload the extension by
   clicking the reload button in `chrome://extensions`.

## License

MIT License
