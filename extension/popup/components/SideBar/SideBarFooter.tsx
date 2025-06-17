import { useState } from "react";
import { MdAdd } from "react-icons/md";
import { v4 as uuid4 } from 'uuid';
import Category from "../../data/adapters/category";
import Tag from "../../data/adapters/tag";
import { useAppState } from "../../hooks/globalstate";
import { ICategory } from "../../utils/types/schemas";

export default function SideBarFooter() {
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [tagName, setTagName] = useState("");
  const { selectedCategory, setData } = useAppState();


  const handleCreateCategory = () => {
    const category = new Category({
      name: categoryName,
      is_default: 0,
      bookmarks: [],
      id: uuid4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: [],
      tagIds: [],
      bookmarkIds: [],
    });
    category.create()
      .then(() => {
        setData((state: ICategory[]) => {
          return [...state, category]; // shallow copy of the state array
        });
        console.log("Category Created:", categoryName);
        setShowCategoryPopup(false);
        setCategoryName("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCreateTag = () => {
    const tag = new Tag({
      name: tagName,
      id: uuid4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      bookmarkIds: [],
      categoryIds: [],
    });

    tag.create()
      .then(() => {
        setData((state: ICategory[]) => {
          // Find the index of the selected category
          const index = state.findIndex((cat) => cat.id === selectedCategory?.id);
          if (index === -1) return state; // Safety check: if not found, return the current state

          // Modify the selected category's tags array and return the new state
          const updatedCategory = {
            ...state[index], // shallow copy of the category object
            tags: [...state[index].tags, tag], // new tags array
          };

          // Replace the category with the updated one
          state[index] = updatedCategory;
          return state; // Return the new state
        });
      })
      .then(() => {
        console.log("Tag Created:", tagName);
        setShowTagPopup(false);
        setTagName("");
      })
      .catch((error) => {
        console.error(error);
      });

  };

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
