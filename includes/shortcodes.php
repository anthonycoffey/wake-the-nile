<?php
/**
 * Shortcode definitions.
 *
 * @package WakeTheNile
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Register the Glide slider shortcode.
 *
 * @param array $atts Shortcode attributes.
 * @return string HTML output for the slider.
 */
function wtn_glide_shortcode($atts)
{
    $atts = shortcode_atts(
        [
            'type' => 'videos',
        ],
        $atts,
        'glide'
    );

    $type = sanitize_text_field($atts['type']);

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
        echo '<button class="glide__arrow glide__arrow--left" data-glide-dir="<"><span class="dashicons dashicons-arrow-left-alt"></span></button>';
        echo '<button class="glide__arrow glide__arrow--right" data-glide-dir=">"><span class="dashicons dashicons-arrow-right-alt"></span></button>';
        echo '</div>'; // .glide__arrows
        echo '</div>'; // .glide
        echo '</div>'; // .glide-container
    }

    // Return the buffered content
    return ob_get_clean();
}
add_shortcode('glide', 'wtn_glide_shortcode');
