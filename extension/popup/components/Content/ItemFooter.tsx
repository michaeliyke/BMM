import { useState } from "react";
import { PiHashBold } from "react-icons/pi";
import { TiPlus } from "react-icons/ti";
import { ITag } from "../../utils/types/schemas";

/**
 * Footer component that displays a list of tags associated with a bookmark and allows adding new tags.
 */
export default function ItemFooter() {
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  // const bookmark = bookmarkToShow;
  // if (bookmark === null) console.warn("No bookmark selected");

  function handleAddTag() {
    // If there is a selectedCategory, add the tag to the selected category
    // const category = selectedCategory ? new Category(selectedCategory) : null;
    // const bookmark_ = new Bookmark(bookmark!);
    // const tag: ITag = new Tag({
    //   name: newTag,
    //   id: uuidv4(),
    //   created_at: (new Date()).toISOString(),
    //   updated_at: (new Date()).toISOString(),
    //   categoryIds: [],
    //   bookmarkIds: [],
    // });
    /*
        BookmarkTag.createCategoryBookmarkTag(tag, bookmark_, category)
          .then(() => {
            setBookmarks((prevBookmarks) => {
              const updatedBookmarks = prevBookmarks.map((b) => {
                if (b.id === bookmark?.id) {
                  const modifiedBookmark = {
                    ...b,
                    tags: [...b.tags, tag],
                  };
                  setBookmark(modifiedBookmark);
                  return modifiedBookmark;
                }
                return b;
              });
              return updatedBookmarks;
            });
          })
          .catch(console.error)
          .finally(() => {
            setShowTagInput(false);
            setNewTag("");
          }); */
  }

  return <footer className="mt-0 flex flex-wrap gap-1.5 items-center relative">
    {([] as ITag[]).map((tag, tagIndex) => (
      <span
        key={tagIndex}
        className="flex items-center text-xs/2 text-gray-500 italic"
      >
        <PiHashBold size={12} className="text-gray-400" />
        {tag.name}
      </span>
    ))}

    {/* Add Tag Button */}
    <button
      onClick={() => setShowTagInput(!showTagInput)}
      className="flex items-center text-xs/3 justify-center border border-gray-400 rounded-full transition-all duration-300 ease-in-out hover:text-red-800 bg-white w-3 h-3"
      title="Create a tag"
    >
      <TiPlus />
    </button>


    {/* Add Tag Popup */}
    {showTagInput && (
      <div className="absolute bottom-full left-0 bg-white shadow-md rounded-md p-2 w-48 border border-gray-200">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="w-full text-xs p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Enter new tag" />
        <button
          onClick={handleAddTag}
          className="mt-2 w-full bg-blue-500 text-white text-xs py-1 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Add Tag
        </button>
      </div>
    )}
  </footer>;
}
