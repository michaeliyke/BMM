import { useState } from "react";
import { MdAdd } from "react-icons/md";
import { v4 as uuid4 } from 'uuid';
import Category from "../../data/adapters/category";
import Tag from "../../data/adapters/tag";
import { useAppState } from "../../hooks/globalstate";
import { error } from "../../utils/functional.lib.dev";
import { IBMM } from "../../utils/types/schemas";

export default function SideBarFooter() {
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [tagName, setTagName] = useState("");
  const { selectedCategory, feedAllStateComponents } = useAppState();


  function handleCreateCategory() {
    Category.create({
      name: categoryName,
      is_default: 0,
      id: uuid4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tagIds: [],
      bookmarkIds: [],
    }).then(function (category) {

      feedAllStateComponents(function (bmm: IBMM) {
        bmm.categoryObjects = { ...bmm.categoryObjects, [category.id]: category };
        bmm.categories = [...bmm.categories, category.id];
        bmm.unlinked.categories = [...bmm.unlinked.categories, category.id];
        return bmm;
      });

      console.log("Category Created:", categoryName);
      setShowCategoryPopup(false);
      setCategoryName("");
    }).catch(error);
  }

  function handleCreateTag() {
    const tag = new Tag({
      name: tagName,
      id: uuid4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      bookmarkIds: [],
      categoryIds: selectedCategory ? [selectedCategory.id] : [],
    });

    tag.create()
      .then(function (tag) {
        feedAllStateComponents(function (bmm: IBMM) {
          bmm.tagObjects = { ...bmm.tagObjects, [tag.id]: tag };
          bmm.tags = [...bmm.tags, tag.id];

          // Link tag to a selected category: 2-way linking (tagIds, categoryIds)
          if (selectedCategory) { // link tag id to category
            selectedCategory.tagIds = [...selectedCategory.tagIds, tag.id];
          } else // or add it to the list of unlinked tags
            bmm.unlinked.tags = [...bmm.unlinked.tags, tag.id];

          return bmm;
        });

        return selectedCategory || null;
      }).then(function (category) {
        // Update the category if there are tags
        if (category)
          if (category.tagIds.length > 0)
            Category.update(category);
          else
            throw ("The ID of new tag was not added to the selected bookmark");
      })
      .then(function () {
        console.log("Tag Created:", tagName);
        setShowTagPopup(false);
        setTagName("");
      })
      .catch(error);

  }

  return (
    <footer className="relative flex items-center p-2 bg-gray-100 border-t space-x-4">
      {/* Create Category Button */}
      <button
        onClick={() => setShowCategoryPopup(!showCategoryPopup)}
        className="flex items-center justify-center gap-2 px-3 pr-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-full shadow-md hover:bg-blue-700 focus:outline-none transition"
      >
        <MdAdd size={16} />
        <span>Category</span>
      </button>

      {/* Popup for Create Category */}
      {showCategoryPopup && (
        <div className="absolute bottom-full mb-2 left-0 w-48 bg-white shadow-lg rounded-md p-3 z-10">
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full text-gray-500 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleCreateCategory}
            className="mt-2 w-full px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Create
          </button>
        </div>
      )}

      {/* Create Tag Button */}
      <button
        onClick={() => setShowTagPopup(!showTagPopup)}
        className="flex items-center justify-center gap-2 px-3 pr-6 py-2 bg-green-600 text-white text-sm font-medium rounded-full shadow-md hover:bg-green-700 focus:outline-none transition"
      >
        <MdAdd size={16} />
        <span>Tag</span>
      </button>

      {/* Popup for Create Tag */}
      {showTagPopup && (
        <div className="absolute bottom-full mb-2 left-0 w-48 bg-white shadow-lg rounded-md p-3 z-10">
          <input
            type="text"
            placeholder="Tag Name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            className="w-full p-2 border text-gray-500 border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-300"
          />
          <button
            onClick={handleCreateTag}
            className="mt-2 w-full px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Create
          </button>
        </div>
      )}
    </footer>
  );
}
