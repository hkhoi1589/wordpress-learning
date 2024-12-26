<div class="post-item">
	<li class="professor-card__list-item">
		<a class="professor-card" href="<?php the_permalink() ?>">
			<?php the_post_thumbnail('professorLandscape', ['class' => 'professor-card__image', 'alt' => 'professorLandscape.jpg'])  ?>
			<span class="professor-card__name"><?php the_title() ?></span>
		</a>
	</li>
</div>