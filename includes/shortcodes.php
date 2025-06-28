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

        echo '<div class="hero" data-component="fadereveal">';
        echo '<div class="hero__wrapper container">';
        echo '<div class="slider slider--big glide" data-component="hero">';
        echo '<div class="slider__arrows" data-glide-el="controls">';
        echo '<button class="slider__arrow slider__arrow--prev glide__arrow glide__arrow--prev" data-ref="fadereveal[el]" data-glide-dir="<">';
        echo '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 12l10.975 11 2.848-2.828-6.176-6.176H24v-3.992H7.646l6.176-6.176L10.975 1 0 12z"/></svg>';
        echo '</button>';
        echo '<button class="slider__arrow slider__arrow--next glide__arrow glide__arrow--next" data-ref="fadereveal[el]" data-glide-dir=">">';
        echo '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/></svg>';
        echo '</button>';
        echo '</div>';

        echo '<div class="frames glide__track" data-component="slidereveal" data-glide-el="track">';
        echo '<ul class="frames__list glide__slides">';

        if ($videos_query->have_posts()) {
            while ($videos_query->have_posts()) {
                $videos_query->the_post();
                $video_url = get_field('video_url');
                if ($video_url) {
                    echo '<li class="frames__item glide__slide">';
                    echo '<div data-ref="slidereveal[el]">';
                    echo '<div class="frame" data-ref="hero[el]">';
                    echo '<video width="100%" height="auto" controls preload="metadata">';
                    echo '<source src="' . esc_url($video_url) . '" type="video/mp4">';
                    echo 'Your browser does not support the video tag.';
                    echo '</video>';
                    echo '</div>';
                    echo '</div>';
                    echo '</li>';
                }
            }
            wp_reset_postdata();
        } else {
            echo '<li class="frames__item glide__slide">No videos found</li>';
        }

        echo '</ul>';
        echo '</div>'; // .frames
        echo '</div>'; // .slider
        echo '</div>'; // .hero__wrapper
        echo '</div>'; // .hero
    }

    // Return the buffered content
    return ob_get_clean();
}
add_shortcode('glide', 'wtn_glide_shortcode');
