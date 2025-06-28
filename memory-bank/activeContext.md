# Active Context: Video Slider Desktop Fix

## Current Focus

The current task was to fix the desktop appearance of the video slider. The "cover all" effect was causing visual distortions on larger screens.

## Recent Changes

*   **`js/glide-init.js`**:
    *   Adjusted the `perView` and `gap` settings in the Glide.js breakpoints for better desktop layouts.
    *   Reduced the rotation angle in the `createCoverflowEffect` function to make the 3D effect less extreme.
*   **`css/styles.css`**:
    *   Changed the `max-width` of `.glide__slide` to `100%` to allow slides to scale properly.
*   **`memory-bank/progress.md`**:
    *   Updated the "Known Issues" section to document the desktop slider problem and its resolution.

## Next Steps

1.  Verify that the implemented fix resolves the issue on desktop.
2.  Await further instructions or tasks.

## Key Learnings & Insights

*   The plugin is heavily reliant on the Advanced Custom Fields (ACF) plugin. Any work on this project will require ACF to be active and correctly configured.
*   The plugin creates its own `js/blocks.js` and `css/blocks.css` files upon activation. This is a clever way to ensure the plugin is self-contained, but it also means that changes to these files should be made carefully, as they could be overwritten. The source of truth for these files is within the main `index.php` file.
