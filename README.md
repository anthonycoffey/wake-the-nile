# Wake the Nile - Custom WordPress Plugin

## Description
Wake the Nile is a custom WordPress plugin that extends the functionality of a WordPress site by adding custom fields, styles, and interactive elements. The plugin includes a custom slider implementation using Glide.js and various enhancements to improve the site's UX.

## Features
- Custom fields support in WordPress.
- Glide.js integration for smooth, responsive sliders.
- Custom CSS and JavaScript for animations and UI improvements.
- Enqueueing of external styles and scripts for better maintainability.

## Installation
1. Upload the `wake-the-nile` plugin folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the WordPress admin panel under **Plugins**.
3. Ensure dependencies (like Glide.js) are correctly enqueued and loaded.

## File Structure
```
wake-the-nile/
│-- index.php              # Main plugin file, initializes features
│-- css/
│   │-- styles.css         # Custom styles for the plugin
│   │-- blocks.css         # Additional UI styling
│-- js/
│   │-- glide-init.js      # Glide.js initialization script
│   │-- autoplay.js        # Handles autoplay functionality
│   │-- blocks.js          # Manages block-based UI components
```

## Usage
- Once activated, the plugin automatically integrates its features into the WordPress site.
- Styles and scripts are enqueued dynamically to avoid conflicts with other themes/plugins.
- Developers can modify the styles and scripts inside the `css/` and `js/` directories for customization.

## Dependencies
- [Glide.js](https://glidejs.com/) - Used for the slider/carousel functionality.
- WordPress 5.0+ - Required for compatibility.

## Author
Developed by **Anthony Coffey**

## License
This project is licensed under the MIT License.


