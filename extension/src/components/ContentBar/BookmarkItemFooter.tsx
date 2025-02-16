import { Dispatch, SetStateAction, useState } from "react";
import { PiHashBold } from "react-icons/pi";
import { TiPlus } from "react-icons/ti";
import { v4 as uuidv4 } from "uuid";
import Bookmark from "../../data/adapters/bookmark";
import BookmarkTag from "../../data/adapters/bookmark_tag";
import Category from "../../data/adapters/category";
import Tag from "../../data/adapters/tag";
import { IBookmark, ICategory } from "../../utils/types/schemas";
type FooterProps = {
    bookmark: IBookmark;
    setBookmark: Dispatch<SetStateAction<IBookmark | null>>;
    bookmarks: IBookmark[];
    setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
    selectedCategory: ICategory | null;
};

/**
 * Footer component that displays a list of tags associated with a bookmark and allows adding new tags.
 *
 * @component
 * @param {FooterProps} props - The properties object.
 * @param {Bookmark} props.bookmark - The bookmark object containing tags.
 *
 * @example
 * // Example usage of Footer component
 * <Footer bookmark={bookmark} />
 *
 * @returns {JSX.Element} The rendered Footer component.
 */
export default function BookmarkItemFooter(props: FooterProps) {
    const { bookmark, selectedCategory, setBookmarks, setBookmark } = props;
    const [showTagInput, setShowTagInput] = useState(false);
    const [newTag, setNewTag] = useState("");

    function handleAddTag() {
        // If there is a selectedCategory, add the tag to the selected category
        const category = selectedCategory ? new Category(selectedCategory) : null;
        const bookmark_ = new Bookmark(bookmark);
        const tag = new Tag({
            name: newTag,
            id: uuidv4(),
            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString(),
        });

        BookmarkTag.createCategoryBookmarkTag(tag, bookmark_, category)
            .then(() => {
                setBookmarks((prevBookmarks) => {
                    const updatedBookmarks = prevBookmarks.map((b) => {
                        if (b.id === bookmark.id) {
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
            });
    }

    return <footer className="mt-1 flex flex-wrap gap-1.5 items-center relative">
        {bookmark.tags.map((tag, tagIndex) => (
            <span
                key={tagIndex}
                className="flex items-center text-2xs text-gray-500 italic"
            >
                <PiHashBold size={12} className="text-gray-400" />
                {tag.name}
            </span>
        ))}

        {/* Add Tag Button */}
        <button
            onClick={() => setShowTagInput(!showTagInput)}
            className="flex items-center text-3xs justify-center border border-gray-400 rounded-full transition-all duration-300 ease-in-out hover:text-red-800 bg-white w-3 h-3"
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
