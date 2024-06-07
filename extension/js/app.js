import { fetchLinks, fetchTags, addLink, addTag, fetchCategories, addCategories } from '../js/fetch.js';

document.addEventListener('DOMContentLoaded', () => {
    const addCategoriesBtn = document.querySelector(".add-categories-btn");
    const addTagBtn = document.querySelector(".add-tag-btn");
    const categoryDropdown = document.querySelector("#category-dropdown");
    const tagDropdown = document.querySelector("#tags-dropdown");
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

        defaultTags.forEach(tag => {
            const newOption = document.createElement("option");
            newOption.value = tag.toLowerCase().replace(/\s+/g, '-');
            newOption.textContent = tag;
            tagDropdown.appendChild(newOption);
        });

        populateFilterDropdowns();
    }

    // Populate filter dropdowns with categories and tags
    function populateFilterDropdowns() {
        filterCategoryDropdown.innerHTML = '<option value="all">All</option>';
        filterTagDropdown.innerHTML = '<option value="all">All</option>';

        Array.from(categoryDropdown.options).forEach(option => {
            if (option.value !== "default") {
                const filterOption = document.createElement("option");
                filterOption.value = option.value;
                filterOption.textContent = option.textContent;
                filterCategoryDropdown.appendChild(filterOption);
            }
        });

        Array.from(tagDropdown.options).forEach(option => {
            if (option.value !== "default") {
                const filterOption = document.createElement("option");
                filterOption.value = option.value;
                filterOption.textContent = option.textContent;
                filterTagDropdown.appendChild(filterOption);
            }
        });
    }

    // Call this function whenever a new category or tag is added
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
            tagDropdown.appendChild(newOption);
            populateFilterDropdowns(); // Update filter dropdowns
            alert("New tag added successfully");
        } else {
            alert("Tag name cannot be empty");
        }
    });

    createButton.addEventListener("click", () => {
        const url = document.querySelector("#url").value;
        const category = categoryDropdown.value;
        const tags = Array.from(tagsContainer.children).map(tag => tag.textContent);

        if (url.trim() === '') {
            alert("URL cannot be empty");
            return;
        }

        const newLink = { url, category, tags };

        // Call the addLink function to send the data to the backend
        addLink(newLink)
            .then(displayLink)
            .catch(error => {
                console.error('Error adding link:', error);
                alert('Error adding link: ' + error.message);
            });

        // Clear inputs
        document.querySelector("#url").value = '';
        categoryDropdown.value = 'default';
        tagsContainer.innerHTML = '';
    });

    function editBookmark(bookmarkItem) {
        const newUrl = prompt("Enter the new URL:", bookmarkItem.querySelector("a").href);
        const newCategory = prompt("Enter the new category:", bookmarkItem.querySelector("h3").textContent.split(": ")[1]);
        const newTags = prompt("Enter the new tags (comma-separated):", bookmarkItem.querySelector("p").textContent.split(": ")[1]);

        if (newUrl && newCategory && newTags) {
            bookmarkItem.querySelector("a").href = newUrl;
            bookmarkItem.querySelector("a").textContent = newUrl;
            bookmarkItem.querySelector("h3").textContent = `Category: ${newCategory}`;
            bookmarkItem.querySelector("p").textContent = `Tags: ${newTags}`;
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
        const listItem = document.createElement("div");
        listItem.classList.add("bookmark-item");
        listItem.innerHTML = `
            <h3>Category: ${link.category}</h3>
            <a href="${link.url}" target="_blank">${link.url}</a>
            <p>Tags: ${link.tags.join(", ")}</p>
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
            const links = await fetchLinks();
            links.forEach(displayLink);

            const tags = await fetchTags();
            tags.forEach(tag => {
                const newOption = document.createElement("option");
                newOption.value = tag.toLowerCase().replace(/\s+/g, '-');
                newOption.textContent = tag;
                tagDropdown.appendChild(newOption);
            });
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    })();

    // Populate default dropdowns
    populateDefaultDropdowns();
});
