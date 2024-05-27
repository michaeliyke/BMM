/**
 * @fileoverview This file is used to bookmark the current page.
 */
const log = console.log.bind(console);

const util = {

  loadBookmarks() {
    const bookmarks_url = '../js/lib/MOCK_DATA.json';
    return new Promise((resolve, reject) => {
      try {
        $.getJSON(bookmarks_url, function (data) {
          // Get an array of bookmarks grouped by category names
          let categories = data.map((bookmark) => bookmark.category);
          categories = [...new Set(categories)].sort().slice(0, 10);
          const bookmarks = categories.map((category) => {
            const bkmrks = data.filter((bkmrk) => bkmrk.category === category);
            return { name: category.toUpperCase(), data: bkmrks };
          });
          resolve(bookmarks);
        });
      } catch {
        reject('Error loading bookmarks');
      }
    });
  },

  bookmarkCreateHandler(eventObject) {
    eventObject.preventDefault(); // Prevent submission, manual control
    /* A title has to be included in this list and two less prominent drop
    menus to the exteme left given for category and tags selection */
    const description = $('.form-group .description-input').val();
    const url = $('.form-group .url-input').val();
    const category = $('.category-select option:selected').val();
    const bookmark = { description, url, category };

    if (!url) {
      return;
    }

    const newBookmark = util.saveBookmark(bookmark);
    util.insertBookmark(newBookmark);
  },

  saveBookmark(bookmark) {
    const newBookmark = bookmark;
    // Save the bookmark to the database
    return newBookmark;
  },

  insertBookmark(newBookmark) {
    let { category = '', url, description = '', title = '' } = newBookmark;
    const linkName = title || url;
    const bookmarkArea = $('main .bookmark-list');
    const html = `<div class='bookmark-item'>
      <h3>${title}</h3>
      <a href='${url}' target='_blank'>${linkName}</a>
      <p>${description}</p>
      <div class="bookmark-actions">
						<button>Edit</button>
						<button>Delete</button>
      </div></div>`;
    bookmarkArea.append($(html));
    $('.bookmark-item').last().hide().fadeIn(200);
    $('form.form-container').trigger('reset');
  }
};

export default util;
