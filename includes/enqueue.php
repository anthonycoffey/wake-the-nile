<?php
/**
 * Enqueue scripts and styles.
 *
 * @package WakeTheNile
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Enqueue custom styles and scripts for the frontend.
 */
function wtn_enqueue_frontend_assets()
{
    // Enqueue Swiper.js assets from CDN
    wp_enqueue_style('swiper-css', 'https://unpkg.com/swiper/swiper-bundle.min.css');
    wp_enqueue_script('swiper-js', 'https://unpkg.com/swiper/swiper-bundle.min.js', [], null, true);

    // Enqueue plugin-specific styles and scripts
    wp_enqueue_style('wtn-styles', plugin_dir_url(WTN_PLUGIN_FILE) . 'css/styles.css', [], WTN_VERSION);
    wp_enqueue_script('wtn-swiper-init', plugin_dir_url(WTN_PLUGIN_FILE) . 'js/swiper-init.js', ['swiper-js'], WTN_VERSION, true);

    // Enqueue block-specific styles
    wp_enqueue_style('wtn-blocks-style', plugin_dir_url(WTN_PLUGIN_FILE) . 'css/blocks.css', [], filemtime(plugin_dir_path(WTN_PLUGIN_FILE) . 'css/blocks.css'));

    // Enqueue Dashicons
    wp_enqueue_style('dashicons');
}
add_action('wp_enqueue_scripts', 'wtn_enqueue_frontend_assets');

/**
 * Enqueue scripts and styles for the admin area.
 */
function wtn_enqueue_admin_assets()
{
    // Enqueue Google Maps API for the admin editor
    $api_key = get_option('google_maps_api_key');
    if (!empty($api_key)) {
        wp_enqueue_script(
            'google-maps',
            'https://maps.googleapis.com/maps/api/js?key=' . esc_attr($api_key) . '&v=quarterly',
            [],
            null,
            true
        );
    }

    // Register the main block editor script
    wp_register_script(
        'wtn-block-editor',
        plugins_url('js/blocks.js', WTN_PLUGIN_FILE),
        ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n', 'wp-block-editor'],
        filemtime(plugin_dir_path(WTN_PLUGIN_FILE) . 'js/blocks.js')
    );
}
add_action('admin_enqueue_scripts', 'wtn_enqueue_admin_assets');
