# Feature 4: Clipboard (`features/4.Clipboard`)

## Product Purpose
Enables one-tap copying of listing deep links, seller WhatsApp numbers/emails, and transaction IDs with native toasts. Also includes smart clipboard monitoring: on application resume, detects if the student recently copied a `campusmarket://listing/:id` link and presents a floating quick-launch banner.

## Key Files
- `useClipboard.js`: Hook managing copy/paste functions and app-resume link detection.
- `ClipboardBanner.jsx`: Interactive alert banner offering instant navigation to copied items.
