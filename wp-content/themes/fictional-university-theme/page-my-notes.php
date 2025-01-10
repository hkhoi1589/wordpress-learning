<?php
if (!is_user_logged_in()) {
	wp_redirect(esc_url(site_url('/')));
	// should we do a toast here?
	exit;
}

get_header();

while (have_posts()) {
    the_post(); // must have
    pageBanner();
?>
    <div class="container container--narrow page-section">
		<div class="create-note">
			<h2>Create New Note</h2>
			<input class="new-note-title" type="text" placeholder="Title">
			<textarea class="new-note-body" name="" id="" placeholder="Your note here...."></textarea>
			<span class="submit-note">Create Note</span>
		</div>
        <ul class="min-list link-list" id="my-notes">
		<?php 
			$userNotes = new WP_Query(array(
				'post_type' => 'Note',
				'posts_per_page' => -1, // -1 for all items
				'author' => get_current_user_id(),
			));

			while ($userNotes->have_posts()) {
				$userNotes->the_post(); // will get the appropriate data for each post
				?>
				<li data-id="<?php the_ID() ?>" >
					<input class="note-title-field" value="<?php echo esc_attr(get_the_title()) ?>" type="text" readonly>
					<button class="edit-note" type="button">
						<i class="fa fa-pencil" aria-hidden="true"></i>
						Edit
					</button>
					<button class="delete-note" type="button">
						<i class="fa fa-trash-o" aria-hidden="true"></i>
						Delete
					</button>
					<textarea class="note-body-field" name="" id="" readonly>
						<?php echo esc_attr(wp_strip_all_tags(get_the_content())) ?>
					</textarea>
					<button class="update-note btn btn--blue btn--small" type="button">
						<i class="fa fa-arrow-right" aria-hidden="true"></i>
						Save
					</button>
				</li>
				<?php
			}

			echo paginate_links(array(
				'total' => $userNotes->max_num_pages
			));

			// clear custom query
			wp_reset_postdata()
		?>
		</ul>
    </div>
<?php
}

get_footer();
?>