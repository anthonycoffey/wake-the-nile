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
 * Register the Swiper.js coverflow slider shortcode.
 *
 * @param array $atts Shortcode attributes.
 * @return string HTML output for the slider.
 */
function wtn_video_coverflow_shortcode($atts)
{
    // Start output buffering
    ob_start();

    // Query for video posts
    $args = [
        'post_type'      => 'video',
        'post_status'    => 'publish',
        'posts_per_page' => -1, // Get all published videos
        'orderby'        => 'date',
        'order'          => 'DESC',
    ];

    $videos_query = new WP_Query($args);

    if ($videos_query->have_posts()) {
        echo '<div class="wtn-video-slider-container">';
        echo '<div class="loading-overlay">';
        echo '<div class="loading-spinner"></div>';
        echo '<p>Loading... Please wait</p>';
        echo '</div>';
        echo '<div class="swiper wtn-video-slider" style="display: none;">';
        echo '<div class="swiper-wrapper">';

        while ($videos_query->have_posts()) {
            $videos_query->the_post();
            $video_url = get_field('video_url');
            if ($video_url) {
                echo '<div class="swiper-slide">';
                echo '<div class="unmute-overlay"><span class="dashicons dashicons-controls-volumeon"></span> Tap to Unmute</div>';
                echo '<video controls muted preload="auto" playsinline>';
                echo '<source src="' . esc_url($video_url) . '" type="video/mp4">';
                echo 'Your browser does not support the video tag.';
                echo '</video>';
                echo '</div>';
            }
        }
        wp_reset_postdata();

        echo '</div>'; // .swiper-wrapper

        // Add pagination and navigation buttons
        echo '<div class="swiper-pagination"></div>';
        echo '<div class="swiper-button-prev"></div>';
        echo '<div class="swiper-button-next"></div>';

        echo '</div>'; // .swiper
        echo '</div>'; // .wtn-video-slider-container
    } else {
        echo '<p>No videos found.</p>';
    }

    // Return the buffered content
    return ob_get_clean();
}
add_shortcode('video_coverflow', 'wtn_video_coverflow_shortcode');
