<?php
/**
 * Gutenberg block registration and rendering.
 *
 * @package WakeTheNile
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Register custom blocks for the Show post type fields.
 */
function wtn_register_show_field_blocks()
{
    // Only register blocks if Gutenberg is available.
    if (!function_exists('register_block_type')) {
        return;
    }

    // Register Venue Name Block
    register_block_type('show-fields/venue-name', [
        'api_version'     => 2,
        'editor_script'   => 'wtn-block-editor',
        'render_callback' => 'wtn_render_venue_name_block',
    ]);

    // Register Show Date/Time Block
    register_block_type('show-fields/show-date', [
        'api_version'     => 2,
        'editor_script'   => 'wtn-block-editor',
        'attributes'      => [
            'format' => [
                'type'    => 'string',
                'default' => 'd/m/Y g:i a',
            ],
        ],
        'render_callback' => 'wtn_render_show_date_block',
    ]);

    // Register Tickets Link Block
    register_block_type('show-fields/tickets-link', [
        'api_version'     => 2,
        'editor_script'   => 'wtn-block-editor',
        'attributes'      => [
            'linkText' => [
                'type'    => 'string',
                'default' => 'Get Tickets',
            ],
            'buttonStyle' => [
                'type'    => 'boolean',
                'default' => true,
            ],
            'opensInNewTab' => [
                'type'    => 'boolean',
                'default' => true,
            ],
        ],
        'render_callback' => 'wtn_render_tickets_link_block',
    ]);

    // Register City/State Block
    register_block_type('show-fields/city-state', [
        'api_version'     => 2,
        'editor_script'   => 'wtn-block-editor',
        'attributes'      => [
            'separator' => [
                'type'    => 'string',
                'default' => ', ',
            ],
        ],
        'render_callback' => 'wtn_render_city_state_block',
    ]);

    // Register Google Map Block
    register_block_type('show-fields/google-map', [
        'api_version'     => 2,
        'editor_script'   => 'wtn-block-editor',
        'attributes'      => [
            'height' => [
                'type'    => 'string',
                'default' => '300px',
            ],
            'width' => [
                'type'    => 'string',
                'default' => '100%',
            ],
            'showDirectionsLink' => [
                'type'    => 'boolean',
                'default' => true,
            ],
        ],
        'render_callback' => 'wtn_render_google_map_block',
    ]);
}
add_action('init', 'wtn_register_show_field_blocks');

/**
 * Render the Venue Name block.
 */
function wtn_render_venue_name_block($attributes, $content, $block)
{
    if (!isset($block->context['postId'])) {
        return '';
    }

    $post_id    = $block->context['postId'];
    $venue_name = get_field('venue_name', $post_id);

    if (empty($venue_name)) {
        return '';
    }

    $wrapper_attributes = get_block_wrapper_attributes([
        'class' => 'show-venue-name ' . ($attributes['className'] ?? ''),
    ]);

    return sprintf(
        '<div %1$s>%2$s</div>',
        $wrapper_attributes,
        esc_html($venue_name)
    );
}

/**
 * Render the Show Date/Time block.
 */
function wtn_render_show_date_block($attributes, $content, $block)
{
    if (!isset($block->context['postId'])) {
        return '';
    }

    $post_id   = $block->context['postId'];
    $show_date = get_field('show_date', $post_id);

    if (empty($show_date)) {
        return '';
    }

    $format = !empty($attributes['format']) ? $attributes['format'] : 'd/m/Y g:i a';

    // Convert the date string to a DateTime object
    $date_obj = DateTime::createFromFormat('d/m/Y g:i a', $show_date);
    if ($date_obj) {
        $formatted_date = $date_obj->format($format);
    } else {
        $formatted_date = $show_date; // Fallback
    }

    $wrapper_attributes = get_block_wrapper_attributes([
        'class' => 'show-date-time ' . ($attributes['className'] ?? ''),
    ]);

    return sprintf(
        '<div %1$s>%2$s</div>',
        $wrapper_attributes,
        esc_html($formatted_date)
    );
}

/**
 * Render the Tickets Link block.
 */
function wtn_render_tickets_link_block($attributes, $content, $block)
{
    if (!isset($block->context['postId'])) {
        return '';
    }

    $post_id      = $block->context['postId'];
    $tickets_link = get_field('tickets_link', $post_id);

    if (empty($tickets_link)) {
        return '';
    }

    $link_text       = !empty($attributes['linkText']) ? $attributes['linkText'] : 'Get Tickets';
    $button_style    = isset($attributes['buttonStyle']) ? $attributes['buttonStyle'] : true;
    $opens_in_new_tab = isset($attributes['opensInNewTab']) ? $attributes['opensInNewTab'] : true;

    $wrapper_attributes = get_block_wrapper_attributes([
        'class' => 'show-tickets-link ' . ($attributes['className'] ?? ''),
    ]);

    $link_class  = $button_style ? 'tickets-button' : 'tickets-text-link';
    $target_attr = $opens_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : '';

    return sprintf(
        '<div %1$s><a href="%2$s" class="%3$s" %4$s>%5$s</a></div>',
        $wrapper_attributes,
        esc_url($tickets_link),
        esc_attr($link_class),
        $target_attr,
        esc_html($link_text)
    );
}

/**
 * Render the City/State block.
 */
function wtn_render_city_state_block($attributes, $content, $block)
{
    if (!isset($block->context['postId'])) {
        return '';
    }

    $post_id = $block->context['postId'];
    $city    = get_field('city', $post_id);
    $state   = get_field('state', $post_id);

    if (empty($city) && empty($state)) {
        return '';
    }

    $separator = !empty($attributes['separator']) ? $attributes['separator'] : ', ';
    $location  = '';

    if (!empty($city) && !empty($state)) {
        $location = esc_html($city) . esc_html($separator) . esc_html($state);
    } elseif (!empty($city)) {
        $location = esc_html($city);
    } else {
        $location = esc_html($state);
    }

    $wrapper_attributes = get_block_wrapper_attributes([
        'class' => 'show-city-state ' . ($attributes['className'] ?? ''),
    ]);

    return sprintf(
        '<div %1$s>%2$s</div>',
        $wrapper_attributes,
        $location
    );
}


/**
 * Render the Google Map block.
 */
function wtn_render_google_map_block($attributes, $content, $block)
{
    if (!isset($block->context['postId'])) {
        return '';
    }

    $post_id  = $block->context['postId'];
    $map_data = get_field('google_map_url', $post_id);

    if (empty($map_data) || !is_array($map_data) || empty($map_data['lat']) || empty($map_data['lng'])) {
        return '';
    }

    $height          = !empty($attributes['height']) ? $attributes['height'] : '300px';
    $width           = !empty($attributes['width']) ? $attributes['width'] : '100%';
    $show_directions = isset($attributes['showDirectionsLink']) ? $attributes['showDirectionsLink'] : true;

    $wrapper_attributes = get_block_wrapper_attributes([
        'class' => 'show-google-map ' . ($attributes['className'] ?? ''),
    ]);

    $map_url = sprintf(
        'https://www.google.com/maps/embed/v1/place?key=%s&q=%f,%f&zoom=15',
        esc_attr(get_option('google_maps_api_key', '')),
        esc_attr($map_data['lat']),
        esc_attr($map_data['lng'])
    );

    $directions_link_html = '';
    if ($show_directions) {
        $directions_url = sprintf(
            'https://www.google.com/maps/dir/?api=1&destination=%f,%f',
            esc_attr($map_data['lat']),
            esc_attr($map_data['lng'])
        );
        $directions_link_html = sprintf(
            '<div class="map-directions"><a href="%s" target="_blank" rel="noopener">Get Directions</a></div>',
            esc_url($directions_url)
        );
    }

    return sprintf(
        '<div %1$s>
            <div class="map-container" style="height: %2$s; width: %3$s;">
                <iframe
                    width="100%%"
                    height="100%%"
                    style="border:0"
                    loading="lazy"
                    src="%4$s"
                    allowfullscreen>
                </iframe>
            </div>
            %5$s
        </div>',
        $wrapper_attributes,
        esc_attr($height),
        esc_attr($width),
        esc_url($map_url),
        $directions_link_html
    );
}

/**
 * Add a custom block category for "Show Fields" blocks.
 */
function wtn_add_show_blocks_category($categories, $post)
{
    return array_merge(
        $categories,
        [
            [
                'slug'  => 'show-fields',
                'title' => __('Show Fields', 'show-fields-blocks'),
                'icon'  => 'calendar-alt',
            ],
        ]
    );
}
add_filter('block_categories_all', 'wtn_add_show_blocks_category', 10, 2);

/**
 * A filter to automatically publish 'show' posts set to a future date.
 */
function wtn_auto_publish_future_shows($data, $postarr)
{
    if ($data['post_type'] === 'show' && $data['post_status'] === 'future') {
        $data['post_status'] = 'publish';
    }
    return $data;
}
add_filter('wp_insert_post_data', 'wtn_auto_publish_future_shows', 10, 2);
