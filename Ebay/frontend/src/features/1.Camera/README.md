# Feature 1: Camera (`features/1.Camera`)

## Product Purpose
Enables students to photograph campus items directly from their mobile camera with live preview, flash toggle, camera flipping, and retake controls. Supports multi-image selection from the gallery (up to 5 photos) using `expo-image-picker`. Images are compressed (quality 0.7) and uploaded via multipart to the `/api/upload` endpoint.

## Key Files
- `useCamera.js`: Custom hook managing camera/gallery permissions, multi-select, and multipart uploading with progress calculation.
- `CameraScreen.jsx`: Full-screen native camera viewfinder with flip, flash, capture, and retake preview.
