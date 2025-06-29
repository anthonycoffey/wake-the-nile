# Technical Context: Wake the Nile Plugin

## Core Technologies

*   **PHP:** The primary language for all server-side logic, following WordPress development standards.
*   **WordPress Plugin API:** Extensive use of hooks (`add_action`, `add_filter`), shortcodes (`add_shortcode`), and the block registration API (`register_block_type`).
*   **JavaScript (ES5/ES6):** Used for the Gutenberg block editor integration (`js/blocks.js`) and for client-side interactions like the video slider initialization (`js/swiper-init.js`).
*   **HTML5 & CSS3:** Used for the structure and styling of the rendered components.

## Dependencies

*   **Swiper.js:** A third-party JavaScript library used for the video slider. It is loaded from a CDN and configured to lazy-load videos for better performance.
*   **Google Maps API:** Used for rendering the map block. Requires an API key to be configured in the plugin's settings.
*   **Advanced Custom Fields (ACF):** The code uses `get_field()`, which is a clear indicator of a dependency on the ACF plugin to manage the custom fields for the `video` and `show` post types.

## Development Setup

*   A standard WordPress environment is required.
*   The plugin files should be placed in the `wp-content/plugins` directory.
*   The ACF plugin must be installed and activated.
*   Custom fields (`video_url`, `venue_name`, `show_date`, `tickets_link`, `google_map_url`) must be set up in ACF and assigned to their respective post types (`video`, `show`).
