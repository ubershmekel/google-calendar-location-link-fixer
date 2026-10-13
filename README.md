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

## Releasing

`npm run ext:release [patch|minor|major|x.y.z]` (bump defaults to `patch`) bumps
`manifest.json`, builds both store zips, uploads to the Chrome Web Store and to
Firefox Add-ons, then commits and tags the version. Both stores queue the
submission for review; nothing goes live instantly.

One source tree builds both stores. `scripts/package-extension.js` patches the
Firefox manifest with the AMO add-on id and data-collection declaration, and
`scripts/amo-metadata.json` holds the summary, category and license AMO needs
for a listed add-on. `npm run ext:firefox:run` loads the Firefox build in a
throwaway profile.

Run `npm install` once, then copy `.env.example` to `.env` (gitignored) and fill
in the two sets of credentials before the first release. Rehearse with
`npm run ext:release:dry` — it packages for real, then prints a review of both
payloads (file list, sizes, permissions), the listing each one targets, and the
branch and tag you would be shipping from. No upload and no git write happen,
and the manifest bump is rolled back.

A store refusing a step is a normal part of this flow, so the release is
resumable. Every step is attempted, what landed is recorded in
`build/release-state.json`, and the run
exits non-zero listing what is left — the release commit and tag are held back
until nothing is. Re-running the same command resumes that same version and
skips the finished steps, so a publish rejected for missing Privacy practices
fields is fixed in the dashboard and then retried without re-uploading or
burning a version number.

Flags: `--skip-chrome`, `--skip-firefox`, `--no-git`, and `--restart` to abandon an unfinished version and bump a
new one instead.

## License

MIT License
