# System Patterns: Wake the Nile Plugin

## Architectural Overview

The plugin follows a modular, file-based architecture standard for WordPress development. It is designed to be self-contained, minimizing dependencies on other plugins. The main plugin file (`wake-the-nile.php`) acts as the entry point, defining constants and loading functionality from organized files within the `includes/` directory.

### File Structure
-   **`wake-the-nile.php`**: Main plugin file. Handles initialization, defines constants, and includes all other necessary files.
-   **`includes/`**: Directory containing separated logic.
    -   `activation.php`: Handles logic for plugin activation hooks (e.g., creating default files).
    -   `enqueue.php`: Manages the enqueueing of all CSS and JavaScript assets for both the frontend and the admin area.
    -   `shortcodes.php`: Defines all custom shortcodes (e.g., `[glide]`).
    -   `blocks.php`: Contains the registration and server-side rendering logic for all custom Gutenberg blocks.
    -   `settings.php`: Manages the creation and rendering of the admin settings page.

## Key Design Patterns

1.  **Shortcode API for Content Injection:**
    *   The `[glide]` shortcode is a classic example of this pattern. It allows for complex, server-rendered HTML to be injected into any content area that processes shortcodes.
    *   The implementation uses output buffering (`ob_start()`, `ob_get_clean()`) to capture the generated HTML, which is a standard and robust way to handle shortcode rendering.

2.  **Custom Post Types for Data Separation:**
    *   The plugin is designed to work with `video` and `show` custom post types. This separates the data from the presentation, which is a core principle of good WordPress development. The plugin itself does not register these post types, implying they are expected to be registered by the theme or another plugin.

3.  **Dynamic Gutenberg Blocks:**
    *   The "Show Fields" blocks are registered as dynamic blocks (`render_callback`). This means the block's content is rendered on the server-side by a PHP function each time the post is viewed.
    *   This pattern is ideal when the content of the block depends on post metadata (like custom fields) that might change, or when the HTML structure is complex.
    *   The block's editor-side representation (`edit` function in `blocks.js`) is a simple placeholder, as the final rendering is handled by PHP.

4.  **Settings Page for API Keys:**
    *   A dedicated settings page under "Options" is created for the Google Maps API key. This is a standard pattern for handling site-wide configuration and API credentials, keeping them out of the codebase.

5.  **Plugin Activation Hook for Setup:**
    *   The `register_activation_hook` is used to ensure that necessary files (`blocks.js`, `blocks.css`) are created when the plugin is activated. This makes the plugin setup more resilient.
