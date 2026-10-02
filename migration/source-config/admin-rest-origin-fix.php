<?php
/**
 * Force same-origin REST API root inside wp-admin (Gutenberg save).
 */
add_filter('rest_url', function ($url, $path, $blog_id, $scheme) {
    if (is_admin()) {
        return 'https://blog.cinev.com/wp-json/' . ltrim($path, '/');
    }
    return $url;
}, 10, 4);
