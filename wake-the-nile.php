<?php
/**
 * Plugin Name:       Wake the Nile Custom WordPress Plugin
 * Description:       Custom WordPress Plugin to add features and extend the website.
 * Version:           0.3.11
 * Author:            Anthony Coffey
 * Text Domain:       wake-the-nile
 * Domain Path:       /languages
 * Requires at least: 5.8
 * Requires PHP:      7.4
 *
 * @package WakeTheNile
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

// Define plugin constants.
define('WTN_VERSION', '0.3.11');
define('WTN_PLUGIN_FILE', __FILE__);
define('WTN_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('WTN_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include required files.
require_once WTN_PLUGIN_DIR . 'includes/activation.php';
require_once WTN_PLUGIN_DIR . 'includes/enqueue.php';
require_once WTN_PLUGIN_DIR . 'includes/shortcodes.php';
require_once WTN_PLUGIN_DIR . 'includes/blocks.php';
require_once WTN_PLUGIN_DIR . 'includes/settings.php';

/**
 * Add Theme Support
 */
function wtn_theme_support()
{
    add_theme_support('custom-fields');
}
add_action('after_setup_theme', 'wtn_theme_support');
