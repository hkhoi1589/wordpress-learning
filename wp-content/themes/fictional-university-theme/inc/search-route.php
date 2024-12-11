<?php 
	function universityRegisterSearch() {
		register_rest_route('university/v1', 'search', array(
			'methods' => WP_REST_SERVER::READABLE,
			'callback' => 'universitySearchResults'
		));
	};

	function universitySearchResults($data) {
		$mainQuery = new WP_Query(array(
			'post_type' => array('post', 'page', 'professor', 'program', 'campus', 'event'),
			's' => sanitize_text_field($data['term']),
		));

		$results = array(
			'general' => array(),
			'professors' => array(),
			'programs' => array(),
			'events' => array(),
			'campuses' => array(),
		);

		while ($mainQuery->have_posts()) {
			$mainQuery->the_post();

			$column = '';

			switch(get_post_type()) {
				case 'professor': 
					$column = 'professors'; 
					break;

				case 'program': 
					$column = 'programs'; 
					break;

				case 'campus': 
					$column = 'campuses'; 
					break;

				case 'event': 
					$column = 'events'; 
					break;

				default: 
					$column = 'general'; 
					break;
			};

			//push the data in the #2 parameter onto the $results array
			array_push($results[$column], array(
				'title' => get_the_title(),
				'permalink' => get_the_permalink()
			));
		}

		return $results;
	};

	add_action('rest_api_init', 'universityRegisterSearch');
?>