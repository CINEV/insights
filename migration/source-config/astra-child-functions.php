<?php
// 차일드 테마 스타일
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_style(
        'astra-parent-style',
        get_template_directory_uri() . '/style.css'
    );
});

// 리버스 프록시 URL 치환 공통 함수
function cinev_proxy_url( $url ) {
    // 먼저 기본 치환
    $url = str_replace(
        'https://blog.cinev.com',
        'https://cinev.com/insights',
        $url
    );

    // 택소노미 URL에 언어 prefix가 빠진 경우 보정
    // /insights/trends-ja/ → /insights/ja/trends-ja/
    // /insights/news-ko/ → /insights/ko/news-ko/
    $langs = ['ja', 'ko'];
    foreach ( $langs as $lang ) {
        // 이미 /insights/ja/ 가 있으면 스킵
        if ( strpos($url, '/insights/' . $lang . '/') !== false ) continue;
        // -ja 또는 -ko로 끝나는 slug가 있는데 prefix가 없으면 추가
        if ( preg_match('#/insights/([a-z0-9-]+)-' . $lang . '/#', $url) ) {
            $url = str_replace('/insights/', '/insights/' . $lang . '/', $url);
            break;
        }
    }

    return $url;
}

// 포스트 링크
add_filter( 'post_link',      'cinev_proxy_url' );
add_filter( 'post_type_link', 'cinev_proxy_url' );
add_filter( 'page_link',      'cinev_proxy_url' );

// 카테고리 / 태그 / 기타 taxonomy
add_filter( 'category_link',  'cinev_proxy_url' );
add_filter( 'tag_link',       'cinev_proxy_url' );
add_filter( 'term_link',      'cinev_proxy_url' );

// 페이지네이션
add_filter( 'paginate_links', 'cinev_proxy_url' );

// 본문 내 링크
add_filter( 'the_content', 'cinev_proxy_url' );

// 메뉴 링크
add_filter( 'nav_menu_link_attributes', function( $atts ) {
    if ( isset( $atts['href'] ) ) {
        $atts['href'] = cinev_proxy_url( $atts['href'] );
    }
    return $atts;
});

// Yoast canonical
add_filter( 'wpseo_canonical', function( $canonical ) {
    return $canonical ? cinev_proxy_url( $canonical ) : $canonical;
});

// Yoast 브레드크럼
add_filter( 'wpseo_breadcrumb_links', function( $links ) {
    foreach ( $links as &$link ) {
        if ( isset( $link['url'] ) ) {
            $link['url'] = cinev_proxy_url( $link['url'] );
        }
    }
    return $links;
});

// 로고
add_filter( 'astra_logo_url', function() {
    return 'https://cinev.com/insights';
});
add_filter( 'get_custom_logo', 'cinev_proxy_url' );

// Noto Sans JP / KR 로드
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style(
        'noto-sans-cjk',
        'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;600;700&display=swap'
    );
});


add_shortcode( 'cinev_footer_nav', function() {
    $lang = function_exists('pll_current_language') ? pll_current_language() : 'en';

    $base = 'https://cinev.com/insights';
	$prefix = '';
	$suffix = '';

	if ( $lang === 'ja' ) { $prefix = '/ja'; $suffix = '-ja'; }
	if ( $lang === 'ko' ) { $prefix = '/ko'; $suffix = '-ko'; }

	$links = [
		'Blog' => [
			'Trends'    => $base . $prefix . '/trends' . $suffix . '/',
			'News'      => $base . $prefix . '/news' . $suffix . '/',
			'Tutorials' => $base . $prefix . '/tutorials' . $suffix . '/',
			'Showcase'  => $base . $prefix . '/showcase' . $suffix . '/',
		],
		'Features' => [
			'For IP Creators' => $base . '/ai-anime-series-generator' . $suffix . '/',
		],
	];

    ob_start(); ?>
    <div class="cinev-footer-nav">
        <?php foreach ( $links as $col_title => $items ) : ?>
        <div>
            <p class="col-title"><?php echo esc_html( $col_title ); ?></p>
            <?php foreach ( $items as $label => $url ) : ?>
            <a href="<?php echo esc_url( $url ); ?>"><?php echo esc_html( $label ); ?></a>
            <?php endforeach; ?>
        </div>
        <?php endforeach; ?>
    </div>
    <?php
    return ob_get_clean();
});
