<?php
// canonical URL (Rank Math)
add_filter('rank_math/frontend/canonical', fn($url) => str_replace('https://blog.cinev.com', 'https://cinev.com/insights', $url));

// og:url (Rank Math)
add_filter('rank_math/opengraph/url', fn($url) => str_replace('https://blog.cinev.com', 'https://cinev.com/insights', $url));

add_action('wp', function () {
    $isRewrite = isset($_SERVER['HTTP_X_FORWARDED_HOST']) && $_SERVER['HTTP_X_FORWARDED_HOST'] === 'cinev.com';
    if ($_SERVER['HTTP_HOST'] === 'blog.cinev.com' && !$isRewrite) {
        header('X-Robots-Tag: noindex, nofollow');
    }
});

// redirect URL에서 blog.cinev.com → cinev.com 치환 (wp-admin 제외)
add_filter('wp_redirect', function ($location) {
    if (strpos($location, 'wp-admin') !== false || strpos($location, 'wp-login') !== false) {
        return $location;
    }
    return str_replace('https://blog.cinev.com', 'https://cinev.com', $location);
});

// Polylang redirect 비활성화
add_filter('pll_check_canonical_url', '__return_false');
add_filter('pll_translation_url', '__return_false');

// 워드프레스 기본 canonical redirect 비활성화
add_action('template_redirect', function () {
    remove_action('template_redirect', 'redirect_canonical');
}, 0);

add_action('init', function () {
    if (strpos($_SERVER['REQUEST_URI'], 'sitemap') !== false && strpos($_SERVER['REQUEST_URI'], '.xml') !== false) {
        ob_start(function ($output) {
            // 포스트 URL 치환 (https)
            $output = str_replace('https://blog.cinev.com', 'https://cinev.com/insights', $output);
            // 이미지 등 나머지 리소스 URL 치환 (http → https, /insights 없이)
            $output = str_replace('http://blog.cinev.com', 'https://cinev.com', $output);
            return $output;
        });
    }
});
