# Private Photo Timeline

A local photo library with tags, dates and duplicate detection.

Independent local application, with a holographic interface. Requires Node.js 22 or newer.

## Run

Run `npm install`, then `npm start` and open http://127.0.0.1:8806. On Windows you can also double-click START.cmd after installation. Run `npm test` for automated checks.

## Privacy and operation

This app listens only on loopback and has no cloud deployment or remote-access configuration. Do not expose the port publicly. Source code contains no personal documents or credentials. Browser storage is local to the browser profile and origin (including the port); clearing that storage removes saved data. Back up/export anything important. Browser storage is not application-level encryption.

## Features and limitations

JPEG/PNG/WebP/GIF/AVIF originals persist in IndexedDB. Editable dates and tags, search, sorting, original download and catalog export. SHA-256 skips exact byte duplicates; visually similar re-encodings are separate. Dates use file modification time unless edited, not EXIF. Catalog export excludes image bytes; download originals separately. HEIC is unsupported.
