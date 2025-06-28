# Active Context: Codebase Refactoring

## Current Focus

The primary task was to refactor the monolithic `index.php` file into a more organized and maintainable structure, following WordPress plugin development best practices. The refactoring was done without introducing a dependency on Composer for autoloading.

## Recent Changes

*   **Deleted `index.php`**: The original, large plugin file was removed.
*   **Created `wake-the-nile.php`**: This is the new main plugin file. It contains the plugin header, defines necessary constants (`WTN_VERSION`, `WTN_PLUGIN_FILE`, etc.), and includes all the functional components.
*   **Created `includes/` directory**: A new directory to house the separated logic files.
    *   **`includes/activation.php`**: Contains the `wtn_activate` function and related logic for plugin activation.
    *   **`includes/enqueue.php`**: Centralizes all `wp_enqueue_style` and `wp_enqueue_script` calls for both frontend and admin assets.
    *   **`includes/shortcodes.php`**: Contains the `wtn_glide_shortcode` function for the video slider.
    *   **`includes/blocks.php`**: Contains all functions related to registering and rendering the custom Gutenberg blocks.
    *   **`includes/settings.php`**: Contains the functions for creating and rendering the admin settings page.
*   **Updated `systemPatterns.md`**: The memory bank was updated to reflect the new, modular file architecture.

## Next Steps

1.  **City/State Block:** A new block `show-fields/city-state` has been added to display the city and state fields.
2.  **Tickets Link Update:** The `show-fields/tickets-link` block has been updated to open links in a new tab by default.
3.  Update `progress.md`.

## Key Learnings & Insights

*   Refactoring a single-file plugin into a modular structure with an `includes` directory greatly improves code organization and maintainability.
*   Using a main plugin file to define constants and include separated files is a standard and effective pattern in WordPress development that doesn't require a complex autoloader.
*   Prefixing all custom functions (e.g., `wtn_`) helps prevent naming conflicts with WordPress core, themes, and other plugins.
