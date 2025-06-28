<?php
  /**
   * Plugin Name: Wake the Nile Custom WordPress Plugin
   * Description: Custom WordPress Plugin to add features and extend the website.
   * Version: 0.2.1
   * Author: Anthony Coffey
   */

  if (! defined('ABSPATH')) {
    exit;
  }

  if ( ! function_exists( 'get_plugin_data' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
  }
  
  $plugin_data = get_plugin_data( __FILE__ );
  $plugin_version = $plugin_data['Version'];
  define('WAKE_THE_NILE_VERSION', $plugin_version);

  add_theme_support('custom-fields');


  /**
   * Enqueue custom styles and scripts
   */
  function enqueue_custom_styles_and_scripts()
  {
    wp_enqueue_style('dashicons');
    wp_enqueue_style('glide-css', 'https://cdn.jsdelivr.net/npm/@glidejs/glide/dist/css/glide.core.min.css');
    wp_enqueue_style('glide-css-theme', 'https://cdn.jsdelivr.net/npm/glidejs@2.1.0/dist/css/glide.theme.min.css');
    wp_enqueue_style('glide-css-styles', plugin_dir_url(__FILE__) . 'css/styles.css', [  ], WAKE_THE_NILE_VERSION);
    wp_enqueue_script('glide-js', 'https://cdn.jsdelivr.net/npm/@glidejs/glide', [], null, true);
  }

  /**
   * Register the Glide slider shortcode
   */
  function glide_shortcode($atts)
  {
    $atts = shortcode_atts(
      [
        'type' => 'videos',
       ],
      $atts,
      'glide'
    );

    $type = sanitize_text_field($atts[ 'type' ]);

    // Start output buffering
    ob_start();

    // Add different HTML based on type
    if ($type === 'videos') {
      // Query for video posts
      $args = [
        'post_type'      => 'video',
        'post_status'    => 'publish',
        'posts_per_page' => -1, // Get all published videos
        'orderby'        => 'date',
        'order'          => 'DESC',
       ];

      $videos_query = new WP_Query($args);

      echo '<div class="glide-container">';
      echo '<div class="glide videos-slider">';
      echo '<div class="glide__track" data-glide-el="track">';
      echo '<ul class="glide__slides">';
      // Slides would be populated dynamically or hardcoded here

      if ($videos_query->have_posts()) {
        while ($videos_query->have_posts()) {
          $videos_query->the_post();
          $video_url = get_field('video_url');
          if ($video_url) {
            echo '<li class="glide__slide">';
            echo '<div class="glide__slide-inner">';
            echo '<video width="100%" height="auto" controls preload="metadata" data-ref="hero[el]">';
            echo '<source src="' . esc_url($video_url) . '" type="video/mp4">';
            echo 'Your browser does not support the video tag.';
            echo '</video>';
            echo '</div>';
            echo '</li>';
          }
        }
        wp_reset_postdata();
      } else {
        echo '<li class="glide__slide">No videos found</li>';
      }
      echo '</ul>';
      echo '</div>'; // .glide__track
      echo '<div class="glide__arrows" data-glide-el="controls">';
      echo '<button class="glide__arrow glide__arrow--left" data-glide-dir="&lt;"><span class="dashicons dashicons-arrow-left-alt"></span></button>';
      echo '<button class="glide__arrow glide__arrow--right" data-glide-dir="&gt;"><span class="dashicons dashicons-arrow-right-alt"></span></button>';
      echo '</div>'; // .glide__arrows
      echo '</div>'; // .glide
      echo '</div>'; // .glide-container
    }

    // Return the buffered content
    return ob_get_clean();
  }
  add_shortcode('glide', 'glide_shortcode');

  // Hook the enqueue function
  add_action('wp_enqueue_scripts', 'enqueue_custom_styles_and_scripts');

  /**
   * Enqueue autoplay.js script
   */
  function enqueue_video_autoplay_script()
  {
    // Get the plugin directory URL
    $plugin_url = plugin_dir_url(__FILE__);

    // Enqueue the script
    wp_enqueue_script(
      'video-autoplay',               // Handle for the script
      $plugin_url . 'js/autoplay.js', // Path to the script file
      [ 'glide-js' ],                 // Dependencies
      WAKE_THE_NILE_VERSION,          // Version number
      true                            // Load in footer (recommended for performance)
    );
  }

  // Hook into WordPress
  add_action('wp_enqueue_scripts', 'enqueue_video_autoplay_script');

  function auto_publish_future_events($data, $postarr)
  {
    if ($data[ 'post_type' ] === 'show' && $data[ 'post_status' ] === 'future') {
      $data[ 'post_status' ] = 'publish'; // Force publish instead of scheduling
    }
    return $data;
  }
  add_filter('wp_insert_post_data', 'auto_publish_future_events', 10, 2);

  /**
   * Enqueue Google Maps API in WordPress admin
   */
  function enqueue_google_maps_api_in_admin()
  {
    // Get the stored API key
    $api_key = get_option('google_maps_api_key');

    // Only proceed if we have an API key
    if (! empty($api_key)) {
      // Enqueue the Google Maps script
      wp_enqueue_script(
        'google-maps',
        'https://maps.googleapis.com/maps/api/js?key=' . esc_attr($api_key) . '&libraries=places',
        [  ],
        null,
        true
      );
    }
  }
  // Hook the function to admin_enqueue_scripts to load in admin area only
  add_action('admin_enqueue_scripts', 'enqueue_google_maps_api_in_admin');

  /**
   * Register custom blocks for the Show post type fields
   */
  function register_show_field_blocks()
  {
    // Only register blocks if Gutenberg is available
    if (! function_exists('register_block_type')) {
      return;
    }

    // Register Venue Name Block
    register_block_type('show-fields/venue-name', [
      'api_version'     => 2,
      'attributes'      => [
        'className' => [
          'type'    => 'string',
          'default' => '',
         ],
       ],
      'uses_context'    => [ 'postId', 'postType', 'queryId' ],
      'render_callback' => 'render_venue_name_block',
     ]);

    // Register Show Date/Time Block
    register_block_type('show-fields/show-date', [
      'api_version'     => 2,
      'attributes'      => [
        'className' => [
          'type'    => 'string',
          'default' => '',
         ],
        'format'    => [
          'type'    => 'string',
          'default' => 'd/m/Y g:i a',
         ],
       ],
      'uses_context'    => [ 'postId', 'postType', 'queryId' ],
      'render_callback' => 'render_show_date_block',
     ]);

    // Register Tickets Link Block
    register_block_type('show-fields/tickets-link', [
      'api_version'     => 2,
      'attributes'      => [
        'className'   => [
          'type'    => 'string',
          'default' => '',
         ],
        'linkText'    => [
          'type'    => 'string',
          'default' => 'Buy Tickets',
         ],
        'buttonStyle' => [
          'type'    => 'boolean',
          'default' => true,
         ],
       ],
      'uses_context'    => [ 'postId', 'postType', 'queryId' ],
      'render_callback' => 'render_tickets_link_block',
     ]);

    // Register Google Map Block
    register_block_type('show-fields/google-map', [
      'api_version'     => 2,
      'attributes'      => [
        'className'          => [
          'type'    => 'string',
          'default' => '',
         ],
        'height'             => [
          'type'    => 'string',
          'default' => '300px',
         ],
        'width'              => [
          'type'    => 'string',
          'default' => '100%',
         ],
        'showDirectionsLink' => [
          'type'    => 'boolean',
          'default' => true,
         ],
       ],
      'uses_context'    => [ 'postId', 'postType', 'queryId' ],
      'render_callback' => 'render_google_map_block',
     ]);

    // Register JavaScript for the editor
    wp_register_script(
      'show-fields-block-editor',
      plugins_url('js/blocks.js', __FILE__),
      [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n', 'wp-block-editor' ],
      filemtime(plugin_dir_path(__FILE__) . 'js/blocks.js')
    );

    // Register editor script for all blocks
    register_block_type('show-fields/blocks', [
      'editor_script' => 'show-fields-block-editor',
     ]);
  }
  add_action('init', 'register_show_field_blocks');

  /**
   * Render the Venue Name block
   */
  function render_venue_name_block($attributes, $content, $block)
  {
    if (! isset($block->context[ 'postId' ])) {
      return '';
    }

    $post_id    = $block->context[ 'postId' ];
    $venue_name = get_field('venue_name', $post_id);

    if (empty($venue_name)) {
      return '';
    }

    $wrapper_attributes = get_block_wrapper_attributes([
      'class' => 'show-venue-name ' . ($attributes[ 'className' ] ?? ''),
     ]);

    return sprintf(
      '<div %1$s>%2$s</div>',
      $wrapper_attributes,
      esc_html($venue_name)
    );
  }

  /**
   * Render the Show Date/Time block
   */
  function render_show_date_block($attributes, $content, $block)
  {
    if (! isset($block->context[ 'postId' ])) {
      return '';
    }

    $post_id   = $block->context[ 'postId' ];
    $show_date = get_field('show_date', $post_id);

    if (empty($show_date)) {
      return '';
    }

    $format = ! empty($attributes[ 'format' ]) ? $attributes[ 'format' ] : 'd/m/Y g:i a';

    // Convert the date string to a DateTime object if it's not already
    if (! $show_date instanceof DateTime) {
      $date_obj = DateTime::createFromFormat('d/m/Y g:i a', $show_date);
      if ($date_obj) {
        $formatted_date = $date_obj->format($format);
      } else {
        $formatted_date = $show_date; // Fallback to original value
      }
    } else {
      $formatted_date = $show_date->format($format);
    }

    $wrapper_attributes = get_block_wrapper_attributes([
      'class' => 'show-date-time ' . ($attributes[ 'className' ] ?? ''),
     ]);

    return sprintf(
      '<div %1$s>%2$s</div>',
      $wrapper_attributes,
      esc_html($formatted_date)
    );
  }

  /**
   * Render the Tickets Link block
   */
  function render_tickets_link_block($attributes, $content, $block)
  {
    if (! isset($block->context[ 'postId' ])) {
      return '';
    }

    $post_id      = $block->context[ 'postId' ];
    $tickets_link = get_field('tickets_link', $post_id);

    if (empty($tickets_link)) {
      return '';
    }

    $link_text    = ! empty($attributes[ 'linkText' ]) ? $attributes[ 'linkText' ] : 'Buy Tickets';
    $button_style = isset($attributes[ 'buttonStyle' ]) ? $attributes[ 'buttonStyle' ] : true;

    $wrapper_attributes = get_block_wrapper_attributes([
      'class' => 'show-tickets-link ' . ($attributes[ 'className' ] ?? ''),
     ]);

    $link_class = $button_style ? 'tickets-button' : 'tickets-text-link';

    return sprintf(
      '<div %1$s><a href="%2$s" class="%3$s" target="_blank" rel="noopener">%4$s</a></div>',
      $wrapper_attributes,
      esc_url($tickets_link),
      esc_attr($link_class),
      esc_html($link_text)
    );
  }

  /**
   * Render the Google Map block
   */
  function render_google_map_block($attributes, $content, $block)
  {
    if (! isset($block->context[ 'postId' ])) {
      return '';
    }

    $post_id  = $block->context[ 'postId' ];
    $map_data = get_field('google_map_url', $post_id);

    if (empty($map_data) || ! is_array($map_data) || empty($map_data[ 'lat' ]) || empty($map_data[ 'lng' ])) {
      return '';
    }

    $height          = ! empty($attributes[ 'height' ]) ? $attributes[ 'height' ] : '300px';
    $width           = ! empty($attributes[ 'width' ]) ? $attributes[ 'width' ] : '100%';
    $show_directions = isset($attributes[ 'showDirectionsLink' ]) ? $attributes[ 'showDirectionsLink' ] : true;

    $wrapper_attributes = get_block_wrapper_attributes([
      'class' => 'show-google-map ' . ($attributes[ 'className' ] ?? ''),
     ]);

    $map_url = sprintf(
      'https://www.google.com/maps/embed/v1/place?key=%s&q=%f,%f&zoom=15',
      esc_attr(get_option('google_maps_api_key', '')), // You need to set this in your plugin settings
      esc_attr($map_data[ 'lat' ]),
      esc_attr($map_data[ 'lng' ])
    );

    $directions_link = '';
    if ($show_directions) {
      $directions_url = sprintf(
        'https://www.google.com/maps/dir/?api=1&destination=%f,%f',
        esc_attr($map_data[ 'lat' ]),
        esc_attr($map_data[ 'lng' ])
      );
      $directions_link = sprintf(
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
      $directions_link
    );
  }

  /**
   * Add block categories for our custom blocks
   */
  function add_show_blocks_category($categories, $post)
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
  add_filter('block_categories_all', 'add_show_blocks_category', 10, 2);

  /**
   * Enqueue frontend styles for the blocks
   */
  function enqueue_show_blocks_styles()
  {
    wp_enqueue_style(
      'show-fields-blocks-style',
      plugins_url('css/blocks.css', __FILE__),
      [  ],
      filemtime(plugin_dir_path(__FILE__) . 'css/blocks.css')
    );
  }
  add_action('wp_enqueue_scripts', 'enqueue_show_blocks_styles');

  /**
   * Create plugin settings page for Google Maps API key
   */
  function show_fields_settings_page()
  {
    add_options_page(
      'Show Fields Settings',
      'Show Fields',
      'manage_options',
      'show-fields-settings',
      'render_show_fields_settings'
    );
  }
  add_action('admin_menu', 'show_fields_settings_page');

  /**
   * Render the settings page
   */
  function render_show_fields_settings()
  {
    if (! current_user_can('manage_options')) {
      return;
    }

    // Save settings if form is submitted
    if (isset($_POST[ 'show_fields_settings_nonce' ]) && wp_verify_nonce($_POST[ 'show_fields_settings_nonce' ], 'show_fields_settings')) {
      if (isset($_POST[ 'google_maps_api_key' ])) {
        update_option('google_maps_api_key', sanitize_text_field($_POST[ 'google_maps_api_key' ]));
      }
      echo '<div class="notice notice-success is-dismissible"><p>Settings saved successfully!</p></div>';
    }

    $api_key = get_option('google_maps_api_key', '');
  ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form method="post" action="">
            <?php wp_nonce_field('show_fields_settings', 'show_fields_settings_nonce'); ?>
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

      /**
       * Create JS directory and file on plugin activation
       */
      function show_fields_blocks_activate()
      {
        // Create JS directory if it doesn't exist
        $js_dir = plugin_dir_path(__FILE__) . 'js';
        if (! file_exists($js_dir)) {
          mkdir($js_dir, 0755, true);
        }

        // Create blocks.js file if it doesn't exist
        $js_file = $js_dir . '/blocks.js';
        if (! file_exists($js_file)) {
          $js_content = create_blocks_js_content();
          file_put_contents($js_file, $js_content);
        }

        // Create CSS directory if it doesn't exist
        $css_dir = plugin_dir_path(__FILE__) . 'css';
        if (! file_exists($css_dir)) {
          mkdir($css_dir, 0755, true);
        }

        // Create blocks.css file if it doesn't exist
        $css_file = $css_dir . '/blocks.css';
        if (! file_exists($css_file)) {
          $css_content = create_blocks_css_content();
          file_put_contents($css_file, $css_content);
        }
      }
      register_activation_hook(__FILE__, 'show_fields_blocks_activate');

      /**
       * Create content for blocks.js
       */
      function create_blocks_js_content()
      {
        return <<<'EOT'
(function(blocks, element, blockEditor, components, i18n) {
    var el = element.createElement;
    var __ = i18n.__;
    var useBlockProps = blockEditor.useBlockProps;
    var InspectorControls = blockEditor.InspectorControls;
    var PanelBody = components.PanelBody;
    var TextControl = components.TextControl;
    var ToggleControl = components.ToggleControl;
    var SelectControl = components.SelectControl;

    // Register Venue Name Block
    blocks.registerBlockType('show-fields/venue-name', {
        title: __('Venue Name', 'show-fields-blocks'),
        icon: 'store',
        category: 'show-fields',
        description: __('Display the venue name for a show.', 'show-fields-blocks'),
        supports: {
            html: false,
            reusable: false,
        },
        edit: function(props) {
            var blockProps = useBlockProps({
                className: 'show-venue-name',
            });

            return el('div', blockProps,
                el('p', {}, __('Venue Name (Show Field)', 'show-fields-blocks'))
            );
        },
        save: function() {
            return null; // Dynamic block, rendered on server side
        }
    });

    // Register Show Date/Time Block
    blocks.registerBlockType('show-fields/show-date', {
        title: __('Show Date/Time', 'show-fields-blocks'),
        icon: 'calendar-alt',
        category: 'show-fields',
        description: __('Display the date and time for a show.', 'show-fields-blocks'),
        attributes: {
            format: {
                type: 'string',
                default: 'd/m/Y g:i a',
            },
        },
        supports: {
            html: false,
            reusable: false,
        },
        edit: function(props) {
            var blockProps = useBlockProps({
                className: 'show-date-time',
            });

            function onChangeFormat(newFormat) {
                props.setAttributes({ format: newFormat });
            }

            return [
                el(InspectorControls, { key: 'inspector' },
                    el(PanelBody, { title: __('Date Format Settings', 'show-fields-blocks'), initialOpen: true },
                        el(TextControl, {
                            label: __('Date Format', 'show-fields-blocks'),
                            value: props.attributes.format,
                            onChange: onChangeFormat,
                            help: __('PHP date format. Default: d/m/Y g:i a', 'show-fields-blocks'),
                        })
                    )
                ),
                el('div', blockProps,
                    el('p', {}, __('Show Date/Time (Show Field)', 'show-fields-blocks'))
                )
            ];
        },
        save: function() {
            return null; // Dynamic block, rendered on server side
        }
    });

    // Register Tickets Link Block
    blocks.registerBlockType('show-fields/tickets-link', {
        title: __('Tickets Link', 'show-fields-blocks'),
        icon: 'tickets-alt',
        category: 'show-fields',
        description: __('Display a link to purchase tickets for a show.', 'show-fields-blocks'),
        attributes: {
            linkText: {
                type: 'string',
                default: 'Buy Tickets',
            },
            buttonStyle: {
                type: 'boolean',
                default: true,
            },
        },
        supports: {
            html: false,
            reusable: false,
        },
        edit: function(props) {
            var blockProps = useBlockProps({
                className: 'show-tickets-link',
            });

            function onChangeLinkText(newText) {
                props.setAttributes({ linkText: newText });
            }

            function onChangeButtonStyle(newValue) {
                props.setAttributes({ buttonStyle: newValue });
            }

            return [
                el(InspectorControls, { key: 'inspector' },
                    el(PanelBody, { title: __('Link Settings', 'show-fields-blocks'), initialOpen: true },
                        el(TextControl, {
                            label: __('Link Text', 'show-fields-blocks'),
                            value: props.attributes.linkText,
                            onChange: onChangeLinkText,
                        }),
                        el(ToggleControl, {
                            label: __('Display as Button', 'show-fields-blocks'),
                            checked: props.attributes.buttonStyle,
                            onChange: onChangeButtonStyle,
                        })
                    )
                ),
                el('div', blockProps,
                    el('p', {}, __('Tickets Link (Show Field)', 'show-fields-blocks'))
                )
            ];
        },
        save: function() {
            return null; // Dynamic block, rendered on server side
        }
    });

    // Register Google Map Block
    blocks.registerBlockType('show-fields/google-map', {
        title: __('Venue Map', 'show-fields-blocks'),
        icon: 'location-alt',
        category: 'show-fields',
        description: __('Display a Google Map for the venue location.', 'show-fields-blocks'),
        attributes: {
            height: {
                type: 'string',
                default: '300px',
            },
            width: {
                type: 'string',
                default: '100%',
            },
            showDirectionsLink: {
                type: 'boolean',
                default: true,
            },
        },
        supports: {
            html: false,
            reusable: false,
        },
        edit: function(props) {
            var blockProps = useBlockProps({
                className: 'show-google-map',
            });

            function onChangeHeight(newHeight) {
                props.setAttributes({ height: newHeight });
            }

            function onChangeWidth(newWidth) {
                props.setAttributes({ width: newWidth });
            }

            function onChangeShowDirections(newValue) {
                props.setAttributes({ showDirectionsLink: newValue });
            }

            return [
                el(InspectorControls, { key: 'inspector' },
                    el(PanelBody, { title: __('Map Settings', 'show-fields-blocks'), initialOpen: true },
                        el(TextControl, {
                            label: __('Height', 'show-fields-blocks'),
                            value: props.attributes.height,
                            onChange: onChangeHeight,
                            help: __('CSS value (e.g., 300px, 50vh)', 'show-fields-blocks'),
                        }),
                        el(TextControl, {
                            label: __('Width', 'show-fields-blocks'),
                            value: props.attributes.width,
                            onChange: onChangeWidth,
                            help: __('CSS value (e.g., 100%, 500px)', 'show-fields-blocks'),
                        }),
                        el(ToggleControl, {
                            label: __('Show Directions Link', 'show-fields-blocks'),
                            checked: props.attributes.showDirectionsLink,
                            onChange: onChangeShowDirections,
                        })
                    )
                ),
                el('div', blockProps,
                    el('p', {}, __('Venue Map (Show Field)', 'show-fields-blocks'))
                )
            ];
        },
        save: function() {
            return null; // Dynamic block, rendered on server side
        }
    });

})(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor,
    window.wp.components,
    window.wp.i18n
);
EOT;
      }

      /**
       * Create content for blocks.css
       */
      function create_blocks_css_content()
      {
        return <<<'EOT'
/* Show Venue Name Block */
.show-venue-name {
    font-weight: 600;
    font-size: 1.1em;
    margin-bottom: 10px;
}

/* Show Date/Time Block */
.show-date-time {
    margin-bottom: 15px;
    color: #333;
}

/* Tickets Link Block */
.show-tickets-link {
    margin: 15px 0;
}

.show-tickets-link .tickets-button {
    display: inline-block;
    background-color: #e63946;
    color: #fff;
    padding: 10px 20px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.3s ease;
}

.show-tickets-link .tickets-button:hover {
    background-color: #c1121f;
    text-decoration: none;
}

.show-tickets-link .tickets-text-link {
    color: #e63946;
    text-decoration: none;
    font-weight: 600;
}

.show-tickets-link .tickets-text-link:hover {
    text-decoration: underline;
}

/* Google Map Block */
.show-google-map {
    margin: 20px 0;
}

.show-google-map .map-container {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.show-google-map .map-directions {
    margin-top: 10px;
    text-align: right;
}

.show-google-map .map-directions a {
    display: inline-block;
    color: #333;
    text-decoration: none;
    font-size: 0.9em;
}

.show-google-map .map-directions a:hover {
    text-decoration: underline;
}

/* Block Editor Styles */
.editor-styles-wrapper .show-venue-name,
.editor-styles-wrapper .show-date-time,
.editor-styles-wrapper .show-tickets-link,
.editor-styles-wrapper .show-google-map {
    padding: 15px;
    background-color: #f8f9fa;
    border: 1px dashed #ccc;
    border-radius: 4px;
}
EOT;
    }
