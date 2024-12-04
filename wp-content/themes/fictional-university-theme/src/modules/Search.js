import $ from 'jquery';

class Search {
    constructor() {
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
        this.resultsDiv.html('Hello 123');
        this.isSpinnerVisible = false;
    }

    typingLogic() {
        if (this.searchField.val() !== this.previousValue) {
            clearInterval(this.typingTimer); // clear previous instance setInterval

            if (this.searchField.val()) {
                if (!this.isSpinnerVisible) {
                    this.resultsDiv.html('<div class="spinner-loader"></div>');
                    this.isSpinnerVisible = true;
                }
                this.typingTimer = setInterval(this.getResults.bind(this), 500);
                this.previousValue = this.searchField.val();
            } else {
                this.resultsDiv.html('');
                this.isSpinnerVisible = false;
            }
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
        this.isOverlayOpen = true;
    }

    closeOverlay() {
        this.searchOverlay.removeClass('search-overlay--active');
        $('body').removeClass('body-no-scroll');
        this.isOverlayOpen = false;
    }
}

export default Search;
