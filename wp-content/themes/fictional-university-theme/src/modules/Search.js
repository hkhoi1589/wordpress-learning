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
        const postResults = fetch(
            `${
                universityData.root_url
            }/wp-json/wp/v2/posts?search=${this.searchField.val()}`
        )
            .then((res) => res.json())
            .catch((err) => console.log('Posts search error:', err));

        const pageResults = fetch(
            `${
                universityData.root_url
            }/wp-json/wp/v2/pages?search=${this.searchField.val()}`
        )
            .then((res) => res.json())
            .catch((err) => console.log('Pages search error', err));

        Promise.all([postResults, pageResults])
            .then((results) => this.renderResults(results))
            .catch((err) => console.log(err));
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

    renderResults(results) {
        //The depth level specifying how deep a nested array structure should be flattened. Defaults to 1.
        let items = results.flat();

        this.resultsDiv.html(`
			<h2 class="search-overlay__section-title">General Information</h2>

			${
                items.length
                    ? `<ul class="link-list min-list">`
                    : '<p>No general infomation matches that search.</p>'
            }

			${items
                .map(
                    (item) => `
				<li>
					<a href="${item.link}">${item.title.rendered}</a> ${
                        item.type == 'post' ? `by ${item.authorName}` : ''
                    }
				</li>
				`
                )
                .join('')}

			${items.length ? '</ul>' : ''}
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
