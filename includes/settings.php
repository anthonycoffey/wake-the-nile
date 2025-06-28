<?php
/**
 * Admin settings page for the plugin.
 *
 * @package WakeTheNile
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Create the plugin settings page for the Google Maps API key.
 */
function wtn_add_settings_page()
{
    add_options_page(
        'Wake the Nile Settings',
        'Wake the Nile',
        'manage_options',
        'wtn-settings',
        'wtn_render_settings_page'
    );
}
add_action('admin_menu', 'wtn_add_settings_page');

/**
 * Render the settings page HTML.
 */
function wtn_render_settings_page()
{
    if (!current_user_can('manage_options')) {
        return;
    }

    // Save settings if form is submitted
    if (isset($_POST['wtn_settings_nonce']) && wp_verify_nonce($_POST['wtn_settings_nonce'], 'wtn_settings_action')) {
        if (isset($_POST['google_maps_api_key'])) {
            update_option('google_maps_api_key', sanitize_text_field($_POST['google_maps_api_key']));
        }
        echo '<div class="notice notice-success is-dismissible"><p>Settings saved successfully!</p></div>';
    }

    $api_key = get_option('google_maps_api_key', '');
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form method="post" action="">
            <?php wp_nonce_field('wtn_settings_action', 'wtn_settings_nonce'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="google_maps_api_key">Google Maps API Key</label>
                    </th>
                    <td>
                        <input type="text" id="google_maps_api_key" name="google_maps_api_key" value="<?php echo esc_attr($api_key); ?>" class="regular-text">
                        <p class="description">Enter your Google Maps API key to enable the map block.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save Settings'); ?>
        </form>
    </div>
    <?php
}
