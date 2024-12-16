import $ from 'jquery';

class Search {
    constructor() {
        this.addSearchHTML();

        this.resultsDiv = $('#search-overlay__results');
        this.openButton = $('.js-search-trigger');
        this.closeButton = $('.search-overlay__close');
        this.searchOverlay = $('.search-overlay');
        this.searchField = $('#search-term');
        this.typingTimer;
        this.previousValue;

        this.events();
        this.isOverlayOpen = false;
        this.isSpinnerVisible = false;
    }

    // Events
    events() {
        this.openButton.on('click', this.openOverlay.bind(this));
        this.closeButton.on('click', this.closeOverlay.bind(this));
        $(document).on('keydown', this.keyPressDispatcher.bind(this));
        this.searchField.on('keyup', this.typingLogic.bind(this));
    }

    // Method
    getResults() {
        fetch(
            `${
                universityData.root_url
            }/wp-json/university/v1/search?term=${this.searchField.val()}`
        )
            .then((res) => res.json())
            .then((result) => this.renderResults(result))
            .catch(
                (err) =>
                    (this.resultsDiv.innerHTML = `Unexpected Error: ${err}`)
            );
    }

    typingLogic() {
        if (this.searchField.val() !== this.previousValue) {
            clearTimeout(this.typingTimer); // clear previous instance setTimeout

            if (this.searchField.val()) {
                if (!this.isSpinnerVisible) {
                    this.resultsDiv.html('<div class="spinner-loader"></div>');
                    this.isSpinnerVisible = true;
                }
                this.typingTimer = setTimeout(this.getResults.bind(this), 500);
            } else {
                this.resultsDiv.html('');
                this.isSpinnerVisible = false;
            }

            this.previousValue = this.searchField.val();
        }
    }

    keyPressDispatcher(e) {
        // if (e.key == 's' && !this.isOverlayOpen) {
        //     this.openOverlay();
        // } else
        if (e.key == 'Escape' && this.isOverlayOpen) {
            this.closeOverlay();
        }
    }

    openOverlay() {
        this.searchOverlay.addClass('search-overlay--active');
        $('body').addClass('body-no-scroll');
        this.searchField.val('');
        setTimeout(() => this.searchField.trigger('focus'), 300);
        this.isOverlayOpen = true;
    }

    closeOverlay() {
        this.searchOverlay.removeClass('search-overlay--active');
        $('body').removeClass('body-no-scroll');
        this.isOverlayOpen = false;
    }

    renderResults({ general, professors, programs, events, campuses }) {
        //The depth level specifying how deep a nested array structure should be flattened. Defaults to 1.
        // let items = results.flat();

        this.resultsDiv.html(`
			<div class="row">
				<div class="one-third">
					<h2 class="search-overlay__section-title">General Information</h2>
					${
                        general.length
                            ? `<ul class="link-list min-list">`
                            : '<p>No general infomation matches that search.</p>'
                    }

					${general
                        .map(
                            (item) => `
						<li>
							<a href="${item.permalink}">${item.title}</a> ${
                                item.postType == 'post'
                                    ? `by ${item.authorName}`
                                    : ''
                            }
						</li>
						`
                        )
                        .join('')}

					${general.length ? '</ul>' : ''}
				</div>

				<div class="one-third">
					<h2 class="search-overlay__section-title">Programs</h2>
					${
                        programs.length
                            ? `<ul class="link-list min-list">`
                            : `<p>No programs match that search. <a href="${universityData.root_url}/programs">View all programs</a></p>`
                    }

					${programs
                        .map(
                            (item) => `
						<li>
							<a href="${item.permalink}">${item.title}</a>
						</li>
						`
                        )
                        .join('')}

					${programs.length ? '</ul>' : ''}

					<h2 class="search-overlay__section-title">Professors</h2>
					${
                        professors.length
                            ? `<ul class="professor-cards">`
                            : `<p>No professors match that search.</p>`
                    }

					${professors
                        .map(
                            (item) => `
							<li class="professor-card__list-item">
								<a class="professor-card" href="${item.permalink}">
									<img class="professor-card__image" src="${item.image}" alt="professor__image.png" />
									<span class="professor-card__name">${item.title}</span>
								</a>
							</li>
							`
                        )
                        .join('')}

					${professors.length ? '</ul>' : ''}
				</div>

				<div class="one-third">
					<h2 class="search-overlay__section-title">Campuses</h2>
					${
                        campuses.length
                            ? `<ul class="link-list min-list">`
                            : `<p>No campuses match that search. <a href="${universityData.root_url}/campuses">View all campuses</a></p>`
                    }

					${campuses
                        .map(
                            (item) => `
						<li>
							<a href="${item.permalink}">${item.title}</a>
						</li>
						`
                        )
                        .join('')}

					${campuses.length ? '</ul>' : ''}

					<h2 class="search-overlay__section-title">Events</h2>
					${
                        events.length
                            ? ''
                            : `<p>No events match that search. <a href="${universityData.root_url}/events">View all events</a></p></p>`
                    }

					${events
                        .map(
                            (item) => `
							<div class="event-summary">
								<a class="event-summary__date t-center" href="${item.permalink}">
									<span class="event-summary__month">
										${item.month}
									</span>
									<span class="event-summary__day">
										${item.day}
									</span>
								</a>
								<div class="event-summary__content">
									<h5 class="event-summary__title headline headline--tiny">
										<a href="${item.permalink}">
											${item.title}
										</a>
									</h5>
									<p>
										${item.description}
										<a href="${item.permalink}" class="nu gray">Learn more</a>
									</p>
								</div>
							</div>
							`
                        )
                        .join('')}

					${events.length ? '</ul>' : ''}
				</div>
			</div>

			
		`);

        this.isSpinnerVisible = false;
    }

    // Trasparent layout when clicking search button in header
    addSearchHTML() {
        $('body').append(`
			<div class="search-overlay">
				<div class="search-overlay__top">
					<div class="container">
						<i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
						<input class="search-term" placeholder="What are you looking for?" autocomplete="off" type="text" name="search-term" id="search-term">
						<i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
					</div>
				</div>

				<div class="container">
					<div id="search-overlay__results">
					</div>
				</div>
			</div>
		`);
    }
}

export default Search;
