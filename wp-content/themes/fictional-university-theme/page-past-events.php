<!-- For past-events page -->

<?php
get_header();
pageBanner(array(
    'title' => 'Past Events',
    'subtitle' => 'A recap of our past events.',
))
?>
<div class="container container--narrow page-section">
    <?php
    $pastEvents = new WP_Query(array(
        // 'posts_per_page' => 1, // -1 for all items
        'paged' => get_query_var('paged', 1), // get current URL and fallback value

        'post_type' => 'Event',

        'meta_key' => 'event_date',
        'orderBy' => 'meta_value_num',
        'order' => 'DESC',
        'meta_query' => array( // filters past dates
            array(
                'key' => 'event_date',
                'compare' => '<',
                'type' => 'numeric',
                'value' => date('Ymd')
            )
        )
    ));

    while ($pastEvents->have_posts()) {
        $pastEvents->the_post(); // will get the appropriate data for each post
        get_template_part('template-parts/content', 'event');
    }

    echo paginate_links(array(
        'total' => $pastEvents->max_num_pages
    ));

    // clear custom query
    wp_reset_postdata()
    ?>
</div>

<?php get_footer() ?>