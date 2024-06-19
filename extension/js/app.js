import { fetchLinks, fetchTags, addLink, addTag, fetchCategories, addCategories } from '../js/fetch.js';

document.addEventListener('DOMContentLoaded', () => {
  const addCategoriesBtn = document.querySelector(".add-categories-btn");
  const addTagBtn = document.querySelector(".add-tag-btn");
  const categoryDropdown = document.querySelector("#category-dropdown");
  // const t_agDropdown = document.querySelector("#tags-dropdown");
  const filterCategoryDropdown = document.querySelector("#filter-category");
  const filterTagDropdown = document.querySelector("#filter-tag");
  const createButton = document.querySelector(".create-button");
  const bookmarkList = document.querySelector(".bookmark-list");
  const tagsContainer = document.querySelector(".tags-container");

  // Default categories and tags
  const defaultCategories = ["Career Paths", "Programming", "Lifestyle"];
  const defaultTags = ["JavaScript", "Python", "Web Development"];

  // Populate dropdowns with default categories and tags
  function populateDefaultDropdowns() {
    defaultCategories.forEach(category => {
      const newOption = document.createElement("option");
      newOption.value = category.toLowerCase().replace(/\s+/g, '-');
      newOption.textContent = category;
      categoryDropdown.appendChild(newOption);
    });

    // defaultTags.forEach(tag => {
    //  const newOption = document.createElement("option");
    // newOption.value = tag.toLowerCase().replace(/\s+/g, '-');
    // newOption.textContent = tag;
    //t_agDropdown.appendChild(newOption);
    //});


  }


  // Call this function to populate dropdowns with default values
  populateDefaultDropdowns();

  addCategoriesBtn.addEventListener("click", () => {
    const categoryName = prompt("Enter the new category name:");
    if (categoryName) {
      const newOption = document.createElement("option");
      newOption.value = categoryName.toLowerCase().replace(/\s+/g, '-');
      newOption.textContent = categoryName;
      categoryDropdown.appendChild(newOption);
      populateFilterDropdowns(); // Update filter dropdowns
      alert("New category added successfully");
    } else {
      alert("Category name cannot be empty");
    }
  });

  addTagBtn.addEventListener("click", () => {
    const tagName = prompt("Enter the new tag name:");
    if (tagName) {
      const newTag = document.createElement("span");
      newTag.classList.add("tag");
      newTag.textContent = tagName;
      tagsContainer.appendChild(newTag);
      const newOption = document.createElement("option");
      newOption.value = tagName.toLowerCase().replace(/\s+/g, '-');
      newOption.textContent = tagName;
      // t_agDropdown.appendChild(newOption);
      populateFilterDropdowns(); // Update filter dropdowns
      alert("New tag added successfully");
    } else {
      alert("Tag name cannot be empty");
    }
  });

  createButton.addEventListener("click", () => {
    const url = document.querySelector("#url").value;
    const description = document.querySelector("#description").value;
    const category = categoryDropdown.value;
    //const tags = Array.from(tagsContainer.children).map(tag => tag.textContent);

    if (url.trim() === '') {
      alert("URL cannot be empty");
      return;
    }

    const newLink = { url, category, description };

    // Call the addLink function to send the data to the backend
    addLink(newLink)
      .then(displayLink)
      .catch(error => {
        console.error('Error adding link:', error);
        alert('Error adding link: ' + error.message);
      });

    // Clear inputs
    document.querySelector("#url").value = '';
    document.querySelector("#description").value = '';
    categoryDropdown.value = 'default';
    // tagsContainer.innerHTML = '';
  });

  function editBookmark(bookmarkItem) {
    const newUrl = prompt("Enter the new URL:", bookmarkItem.querySelector("a").href);
    const newCategory = prompt("Enter the new category:", bookmarkItem.querySelector("h3").textContent.split(": ")[1]);
    const newDescription = prompt("Enter the new description:", bookmarkItem.querySelector("p").textContent.split(": ")[1]);
    const newTags = prompt("Enter the new tags (comma-separated):", bookmarkItem.querySelector("p").textContent.split(": ")[1]);

    if (newUrl && newCategory && newTags) {
      bookmarkItem.querySelector("a").href = newUrl;
      bookmarkItem.querySelector("a").textContent = newUrl;
      bookmarkItem.querySelector("p").textContent = `Description: ${newDescription}`;
      bookmarkItem.querySelector("h3").textContent = `Category: ${newCategory}`;
      bookmarkItem.querySelector(".tags").textContent = `Tags: ${newTags}`;
    } else {
      alert("All fields must be filled out to edit the bookmark");
    }
  }

  function deleteBookmark(bookmarkItem) {
    if (confirm("Are you sure you want to delete this bookmark?")) {
      bookmarkList.removeChild(bookmarkItem);
    }
  }

  const displayLink = (link) => {
    const { url, tags = ["--"], description = "--", category = "--" } = link;
    const listItem = document.createElement("div");
    listItem.classList.add("bookmark-item");

    listItem.innerHTML = `
      <h3>Category: ${category}</h3>
      <a href="${url}" target="_blank">${url}</a>
      <p>Description: ${description || "--"}</p>
      <p class="tags">Tags: ${tags.join(', ')}</p>
      <button class="edit-button">Edit</button>
      <button class="delete-button">Delete</button>
    `;

    bookmarkList.appendChild(listItem);

    // Add event listeners for edit and delete buttons
    listItem.querySelector(".edit-button").addEventListener("click", () => editBookmark(listItem));
    listItem.querySelector(".delete-button").addEventListener("click", () => deleteBookmark(listItem));
  };

  // Call these functions to fetch initial data
  (async () => {
    try {
      // const links = await fetchLinks();
      const allCategories = await fetchLinks();
      // links.forEach((link));

      /* Display all bookmarks */
      for (const category of allCategories) {
        for (const bookmark of category.bookmarks) {
          displayLink(bookmark);
        }
      }

      /* Display all categories */
      displayCategoryNames(allCategories.map((cat) => cat.name));

      const tags = await fetchTags();
      tags.forEach((tag) => {
        const newOption = document.createElement("option");
        newOption.value = (typeof tag === "string" ? tag : "").toLowerCase().replace(/\s+/g, '-');
        newOption.textContent = tag;
        // t_agDropdown.appendChild(newOption);
      });
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  })();

  // Populate default dropdowns
  populateDefaultDropdowns();

  // Add the active class to the currently selected filter option on page load
  highlightSelectedFilter()
});

function highlightSelectedFilter() {
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
  console.log("INDEX OF SELECTION: ", filter.selectedIndex, selected)
}

/* Display a list of strings as category names */
function displayCategoryNames(names) {
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

function displayCategoryName(name) {
  const list = document.querySelector("aside .filtered-list ul");
  const listItem = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = name;
  listItem.appendChild(span);
  // listItem.textContent = name;
  list.appendChild(listItem);
}

/* Capitalizes first letter of each word in a string */
function capilize(str) {
  const words = str.split(" ").map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return words.join(" ");
}

/* Select a DOM element using the querySelector API */
function querySelector(selector, context = document) {
  if (!(context instanceof EventTarget))
    throw new TypeError("querySelector: context must be a DOM object")
  return document.querySelector(selector);
}


