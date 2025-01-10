import $ from 'jquery';

class MyNotes {
    constructor() {
        this.title;
        this.content;

        this.events();
    }

    // Events
    events() {
        $('#my-notes').on('click', '.delete-note', this.deleteNote);
        $('#my-notes').on('click', '.edit-note', this.editNote.bind(this));
        $('#my-notes').on('click', '.update-note', this.updateNote.bind(this));
        $('.submit-note').on('click', this.createNote);
    }

    // Method
    async createNote() {
        let ourNewPost = {
            title: $('.new-note-title').val(),
            content: $('.new-note-body').val(),
            status: 'publish'
        };

        try {
            const response = await fetch(
                `${universityData.root_url}/wp-json/wp/v2/note/`,
                {
                    headers: {
                        'X-WP-Nonce': universityData.nonce,
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'same-origin',
                    method: 'POST',
                    body: JSON.stringify(ourNewPost)
                }
            );
            const result = await response.json();

            // clear inputs
            $('.new-note-title, .new-note-body').val('');

            // real-time insert
            $(`
				<li data-id="${result.id}" >
					<input class="note-title-field" value="${result.title.raw}" type="text" readonly>
					<button class="edit-note" type="button">
						<i class="fa fa-pencil" aria-hidden="true"></i>
						Edit
					</button>
					<button class="delete-note" type="button">
						<i class="fa fa-trash-o" aria-hidden="true"></i>
						Delete
					</button>
					<textarea class="note-body-field" name="" id="" readonly>
						${result.content.raw}
					</textarea>
					<button class="update-note btn btn--blue btn--small" type="button">
						<i class="fa fa-arrow-right" aria-hidden="true"></i>
						Save
					</button>
				</li>
				`)
                .prependTo('#my-notes')
                // for animation
                .hide()
                .slideDown();

            console.log(`SUCCESS`, result);
        } catch (error) {
            console.log(`ERROR : ${error}`);
        }
    }

    async updateNote(event) {
        let item = $(event.currentTarget).parent('li');

        let ourUpdatedPost = {
            title: item.find('.note-title-field').val(),
            content: item.find('.note-body-field').val()
        };

        try {
            const response = await fetch(
                `${universityData.root_url}/wp-json/wp/v2/note/${item.data(
                    'id'
                )}`,
                {
                    headers: {
                        'X-WP-Nonce': universityData.nonce,
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'same-origin',
                    method: 'PATCH',
                    body: JSON.stringify(ourUpdatedPost)
                }
            );
            const result = await response.json();

            this.makeNoteReadOnly(item);
            // Here we update the values again.
            this.saveValues(item);

            console.log(`SUCCESS`, result);
        } catch (error) {
            console.log(`ERROR : ${error}`);
        }
    }

    editNote(event) {
        let item = $(event.currentTarget).parent('li');
        if (
            item
                .find('.note-title-field, .note-body-field')
                .hasClass('note-active-field')
        ) {
            // Reset values again.
            this.previousNote(item);

            // make read only
            this.makeNoteReadOnly(item);
        } else {
            // Here we add 2 lines to store the values.
            this.saveValues(item);

            // make editable
            this.makeNoteEditable(item);
        }
    }

    makeNoteEditable(item) {
        item.find('.edit-note').html(
            '<i class="fa fa-times" aria-hidden="true"></i> Cancel'
        );
        item.find('.note-title-field, .note-body-field')
            .removeAttr('readonly')
            .addClass('note-active-field');
        item.find('.note-title-field').focus().val(this.title);
        item.find('.update-note').addClass('update-note--visible');
    }

    makeNoteReadOnly(item) {
        item.find('.edit-note').html(
            '<i class="fa fa-pencil" aria-hidden="true"></i> Edit'
        );
        item.find('.note-title-field, .note-body-field')
            .attr('readonly', 'readonly')
            .removeClass('note-active-field');
        item.find('.update-note').removeClass('update-note--visible');
    }

    deleteNote(event) {
        let item = $(event.currentTarget).parent('li');
        fetch(
            `${universityData.root_url}/wp-json/wp/v2/note/${item.data('id')}`,
            {
                headers: {
                    'X-WP-Nonce': universityData.nonce
                },
                credentials: 'same-origin',
                method: 'DELETE'
            }
        )
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                console.log(`SUCCESS`, response);
                // for animation
                item.slideUp();
            })
            .catch((err) => console.log(`ERROR : ${err}`));
    }

    saveValues(item) {
        // Here we update the values again.
        this.title = item.find('.note-title-field').val();
        this.content = item.find('.note-body-field').val();
    }

    previousNote(item) {
        // Here we reset the values from this.title, this.content.
        item.find('.note-title-field').val(this.title);
        item.find('.note-body-field').val(this.content);
    }
}

export default MyNotes;
