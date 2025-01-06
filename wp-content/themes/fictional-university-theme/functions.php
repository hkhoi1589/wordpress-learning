<?php

require get_theme_file_path('/inc/search-route.php');

function university_custom_rest() {
	register_rest_field('post', 'authorName', array(
		'get_callback' => function () {
			return get_the_author();
		}
	));
};

add_action('rest_api_init', 'university_custom_rest');

function pageBanner($args = NULL) {
    if (!isset($args['title'])) {
        $args['title'] = get_the_title(); // use default title from BE
    }

    if (!isset($args['subtitle'])) {
        $args['subtitle'] = get_field('page_banner_subtitle'); // use default page_banner_subtitle from BE
    }

    //  if the first event in the list of events has a background image our code can get confused and try to use it as the banner 
    //  for the entire Archive, Blog page
    //  => dont apply in Archive or Blog page
    if (!isset($args['photo'])) {
        $args['photo'] = (get_field('page_banner_background_image') && !is_archive() && !is_home())
            ? get_field('page_banner_background_image')['sizes']['pageBanner']
            : get_theme_file_uri('/images/ocean.jpg');
    }

?>
    <div class='page-banner'>
        <div class='page-banner__bg-image'
            style='background-image: url(<?php echo $args['photo'] ?>)'>
        </div>
        <div class='page-banner__content container container--narrow'>
            <h2 class='page-banner__title'><?php echo $args['title'] ?></h1>
            <div class='page-banner__intro'>
                <p><?php echo $args['subtitle'] ?></p>
            </div>
        </div>
    </div>
<?php
}

function university_files() {
    wp_enqueue_script('university_main_js', get_theme_file_uri('/build/index.js'), array('jquery'), '1.0', true);
    wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i
    Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css'));
    wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));

	// env?
	wp_localize_script('university_main_js', 'universityData', array(
		'root_url' => get_site_url(),
	));
}

add_action('wp_enqueue_scripts', 'university_files');

function university_features() {
    add_theme_support('title-tag'); // for title in browser tab

    // featured image in editor
    add_theme_support('post-thumbnails');
    add_image_size('professorLandscape', 400, 260, true);
    add_image_size('professorPortrait', 480, 650, true);
    add_image_size('pageBanner', 1500, 350, true);
}

add_action('after_setup_theme', 'university_features'); // content 16

// for global query...
function university_adjust_queries($query) {
    if (
        !is_admin() and // not on Backend admin page -> on FE page
        is_post_type_archive('program') and // is program datas
        is_main_query() // self-explained
    ) {
        $query->set('posts_per_page', -1); // -1 for all items
        $query->set('orderby', 'title');
        $query->set('order', 'ASC');
    }

    if (
        !is_admin() and // not on Backend admin page -> on FE page
        is_post_type_archive('event') and // is event datas
        is_main_query() // self-explained
    ) {
        $query->set('posts_per_page', -1); // -1 for all items
        $query->set('meta_key', 'event_date');
        $query->set('orderby', 'meta_value_num');
        $query->set('order', 'ASC');
        $query->set('meta_query', array( // filters past dates
            array(
                'key' => 'event_date',
                'compare' => '>=',
                'type' => 'numeric',
                'value' => date('Ymd')
            )
        ));
    }
}

add_action('pre_get_posts', 'university_adjust_queries');

// Redirect subscriber accounts out of admin dashboard
add_action('admin_init', 'redirectSubstoHome');

function redirectSubstoHome() {
	$ourCurrentUser = wp_get_current_user();

	if (count($ourCurrentUser->roles) == 1 and in_array( 'subscriber', $ourCurrentUser->roles)) {
		wp_redirect(site_url('/'));
		exit;
	}
}

// Hide admin header
add_action('wp_loaded', 'noSubsAdminBar');

function noSubsAdminBar() {
	$ourCurrentUser = wp_get_current_user();

	if (count($ourCurrentUser->roles) == 1 and in_array( 'subscriber', $ourCurrentUser->roles)) {
		show_admin_bar(false);
	}
}

// Customize Login page
add_filter('login_headerurl', 'ourHeaderUrl');
function ourHeaderUrl() {
	return esc_url(site_url('/'));
}

add_filter('login_headertitle', 'ourLoginTitle');
function ourLoginTitle() {
	return get_bloginfo();
}

// Hide admin header
add_action('login_enqueue_scripts', 'ourLoginCss');

function ourLoginCss() {
	wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i
    Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css'));
    wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));
}