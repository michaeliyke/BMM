
export function highlightSelectedFilter() {
  const filter = querySelector("aside select");
  const selected = filter.options[filter.selectedIndex];
  for (const current of filter.options) {
    if (current.classList.contains("current")) {
      current.classList.remove("current");
      break;
    }
  }
  if (selected)
    selected.classList.add("current");
  // console.log("INDEX OF SELECTION: ", filter.selectedIndex, selected)
}

/* Display a list of strings as category names */
export function displayCategoryNames(names) {
  // Filter out the string default, capilize the first letter of the others
  // sort ASCENDING, and then add the string Default back at index[0]
  names = names.filter((name) => name && name.toLowerCase() !== "default");
  names = names.map((name) => capilize(name)).sort();
  names.unshift("Default");

  // Empty the category list and display the new names
  document.querySelector("aside .filtered-list ul").innerHTML = "";
  for (const name of names) {
    displayCategoryName(name);
  }
}

export function displayCategoryName(name) {
  const list = document.querySelector("aside .filtered-list ul");
  const listItem = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = name;
  listItem.appendChild(span);
  // listItem.textContent = name;
  list.appendChild(listItem);
}

/* Capitalizes first letter of each word in a string */
export function capilize(str) {
  const words = str.split(" ").map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return words.join(" ");
}

/* Select a DOM element using the querySelector API */
export function querySelector(selector, context = document) {
  if (!(context instanceof EventTarget))
    throw new TypeError("querySelector: context must be a DOM object")
  return document.querySelector(selector);
}


// correct the width of a fixed item
export function correctWidth(fixedClass, contentClass) {
  const fixed = querySelector(fixedClass);
  const content = querySelector(contentClass);

  if (!(fixed && content))
    return;

  fixed.classList.remove("fixed");
  const height = getComputedStyle(content).height;
  fixed.classList.add("fixed");
  content.style.height = height;
}
