<!-- for each post in programs -->

<?php
get_header();

while (have_posts()) {
    the_post();
    pageBanner()
?>
    <div class="container container--narrow page-section">
        <div class="metabox metabox--position-up metabox--with-home-link">
            <p>
                <a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link('program') ?>">
                    <i class="fa fa-home" aria-hidden="true"></i>
                    All Programs
                </a>
                <span class="metabox__main">Posted by <?php the_author_posts_link() ?> on <?php the_time('n/j/y') ?> in <?php echo get_the_category_list(', ') ?></span>
            </p>
        </div>

        <div class="generic-content">
            <?php the_content() ?>
        </div>

        <?php
        // create custom posts query for professor
        $relatedProfessors = new WP_Query(array(
            'posts_per_page' => -1, // -1 for all items
            'post_type' => 'professor',
            'orderby' => 'title',
            'order' => 'ASC',
            'meta_query' => array( // filter
                array( // has same related_programs to this page
                    'key' => 'related_programs',
                    'compare' => 'LIKE',
                    'value' => get_the_ID()
                )
            )
        ));
        if ($relatedProfessors->have_posts()) {
            echo '<hr class="section-break">';
            echo '<h2 class="headline headline--medium">' . get_the_title() . ' Professors</h2>';

            echo '<ul class="professor-cards">';
            while ($relatedProfessors->have_posts()) {
                $relatedProfessors->the_post()
        ?>
                <li class="professor-card__list-item">
                    <a class="professor-card" href="<?php the_permalink() ?>">
                        <?php the_post_thumbnail('professorLandscape', ['class' => 'professor-card__image', 'alt' => 'professorLandscape.jpg'])  ?>
                        <span class="professor-card__name"><?php the_title() ?></span>
                    </a>
                </li>
            <?php
            }
            echo '</ul>';
        }
        // clear custom query
        wp_reset_postdata();

        // create custom posts query for event
        $homePageEvents = new WP_Query(array(
            'posts_per_page' => 2, // -1 for all items
            'post_type' => 'Event',
            'meta_key' => 'event_date',
            'orderby' => 'meta_value_num',
            'order' => 'ASC',
            'meta_query' => array( // filter
                array( // upcoming event
                    'key' => 'event_date',
                    'compare' => '>=',
                    'type' => 'numeric',
                    'value' => date('Ymd')
                ),
                array( // has same related_programs to this page
                    'key' => 'related_programs',
                    'compare' => 'LIKE',
                    'value' => get_the_ID()
                )
            )
        ));
        if ($homePageEvents->have_posts()) {
            echo '<hr class="section-break">';
            echo '<h2 class="headline headline--medium">Upcoming ' . get_the_title() . ' Events</h2>';

            while ($homePageEvents->have_posts()) {
                $homePageEvents->the_post();
                get_template_part('template-parts/content', 'event');
            }
        }
        // clear custom query
        wp_reset_postdata()
        ?>
    </div>
<?php
}

get_footer()
?>