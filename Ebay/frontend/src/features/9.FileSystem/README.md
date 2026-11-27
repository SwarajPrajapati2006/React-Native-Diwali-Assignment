# Feature 9: FileSystem (`features/9.FileSystem`)

## Product Purpose
Enables robust local file storage and document export on the student's device.
- Listing Drafts: Automatically persists in-progress listing forms and local image paths to `documentDirectory/drafts/` as individual JSON documents with resume and delete capabilities.
- Storage Management: Measures and clears disk image caches from `cacheDirectory`.
- CSV Sales Reporting: Generates clean comma-separated financial reports of sold listings and triggers native file sharing with `expo-sharing`.

## Key Files
- `useFileSystem.js`: Hook wrapping `expo-file-system` directories, draft storage, and CSV document generation.
- `DownloadsStorageScreen.jsx`: Storage health dashboard with draft resume controls and sales export buttons.
