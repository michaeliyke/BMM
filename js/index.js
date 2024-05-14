; jQuery(async function ($) {
  const ce = document.createElement.bind(document); // Create a new element
  const sel = document.querySelector.bind(document); // Select a single element
  const selAll = document.querySelectorAll.bind(document); // all elements
  const selId = document.getElementById.bind(document); // element by its ID
  const selClass = document.getElementsByClassName.bind(document);  // by class
  const selTag = document.getElementsByTagName.bind(document); // by tagName
  const selName = document.getElementsByName.bind(document); // by name
  const log = console.log.bind(console); // console.log
  const l = console.log.bind(console); // console.log

  l("Hello World!")
  await delay(10000);
  l("Hello World! 10 seconds later")
  const ul = ce('ul');
  const navpane = $('b-nav-pane');
  const displaypane = $('b-display-pane');

  navpane.empty();
  displaypane.empty();
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
