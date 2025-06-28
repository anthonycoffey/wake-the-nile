# Active Context: Google Maps API Versioning & Dashicons

## Current Focus

The current focus is to ensure the stability and maintainability of the Google Maps integration and to provide access to Dashicons on the front end.

## Recent Changes

*   **Investigated Google Maps API Usage**: Analyzed the codebase to determine how the Google Maps and Places APIs are being used. Found that the plugin uses the Maps JavaScript API in the admin and the Maps Embed API on the frontend.
*   **Researched API Versioning**: Researched Google's recommended versioning practices for the Maps JavaScript API.
*   **Updated `includes/enqueue.php`**: Modified the script enqueueing to use the `quarterly` channel for the Maps JavaScript API. This provides a more stable and predictable update cycle compared to the `weekly` channel.
*   **Enqueued Dashicons**: Updated `includes/enqueue.php` to include the `dashicons` stylesheet on the front end, making the icon set available for use in the theme.

## Next Steps

1.  Update `progress.md` to reflect the recent changes.

## Key Learnings & Insights

*   Using the `quarterly` channel for the Google Maps JavaScript API is a best practice for production WordPress plugins to avoid unexpected issues from weekly updates.
*   It's important to distinguish between the different Google Maps APIs (JavaScript, Embed, Places Web Service) to understand how they are used and how to properly maintain them.
*   Dashicons can be easily enqueued on the front end using `wp_enqueue_style('dashicons');`.
