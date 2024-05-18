; jQuery(function ($) {
  const ce = document.createElement.bind(document); // Create a new element
  const sel = document.querySelector.bind(document); // Select a single element
  const selAll = document.querySelectorAll.bind(document); // all elements
  const selId = document.getElementById.bind(document); // element by its ID
  const selClass = document.getElementsByClassName.bind(document);  // by class
  const selTag = document.getElementsByTagName.bind(document); // by tagName
  const selName = document.getElementsByName.bind(document); // by name
  const log = console.log.bind(console); // console.log
  const l = console.log.bind(console); // console.log
  const ul_nav = ce('ul');
  const ul_display = ce('ul');
  const navpane = $('.nav-pane');
  const displaypane = $('.display-pane');

  navpane.empty();
  displaypane.empty();


  loadBookmarks().then((categories) => {
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


});

function updateDisplayPane() {
  const category = $(this).data('name');
  const bookmarks = $.categories.find((bkmrk) => bkmrk.name === category).data;
  const displaypane = $('.display-pane');
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

function loadBookmarks() {
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
}

function getCategories(bookmarks) {
  categories = bookmarks.map((bookmark) => {
    return `<li><a href='#'>${bookmark.category.toUpperCase()}</a></li>`;
  });
  return [...new Set(categories)].sort().slice(0, 10);
}
