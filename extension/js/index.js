import bookmark from './bookmark.js';
const { bookmarkCreateHandler } = bookmark;


const ce = document.createElement.bind(document); // Create a new element
const log = console.log.bind(console);

; jQuery(function ($) {
  const ul_nav = ce('ul');
  const navpane = $('.nav-pane');
  const displaypane = $('.display-pane');
  navpane.empty();
  displaypane.empty();

  // Creating a new bookmark

  $('.form-group .url-input').val(location).select().focus();

  $('.bookmark-form .create-button').click(bookmarkCreateHandler);

  // assign var url to the url of the current page using chrom API


  /* loadBookmarks().then((categories) => {
    const li_tags = [];
    $.categories = categories; // Save the categories in the jQuery object
    for (const category of categories) {
      const { name } = category;
      li_tags.push(`<li data-name='${name}' class='nav-item'>
        <a href='#'>${name}</a></li>`);
    }
    // Highlight the first category by default
    li_tags[0] = li_tags[0].replace('nav-item', 'nav-item active');
    $(ul_nav).append(li_tags);
    navpane.append(ul_nav);
    $('.nav-item').on('click', updateDisplayPane);
    $('.nav-item').first().trigger('click');
  }).catch((err) => {
    console.error(err);
  });
 */

});



function updateDisplayPane() {
  const category = $(this).data('name');
  const bookmarks = $.categories.find((bkmrk) => bkmrk.name === category).data;
  const displaypane = $('ul.categories');
  displaypane.empty();
  const ul_display = document.createElement('ul');
  const li_tags = bookmarks.map((bookmark) => {
    return `<li class='display-item'>
      <a href='${bookmark.url}' target='_blank'>${bookmark.title}</a></li>`;
  });
  $(ul_display).append(li_tags);
  displaypane.append(ul_display);
  $('.nav-item').removeClass('active');
  $(this).addClass('active');

}



function getCategories(bookmarks) {
  categories = bookmarks.map((bookmark) => {
    return `<li><a href='#'>${bookmark.category.toUpperCase()}</a></li>`;
  });
  return [...new Set(categories)].sort().slice(0, 10);
}
