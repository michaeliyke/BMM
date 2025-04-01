
import { Dispatch, SetStateAction, useEffect } from "react";
import { getBookmarks } from "../../utils/common";
import { IBookmark, ICategory, ITag } from "../../utils/types/schemas";
import ContentBody from "./ContentBody";
import ContentHeader from "./ContentHeader";

type ContentBarProps = {
  data: ICategory[];
  setData: Dispatch<SetStateAction<ICategory[]>>;
  updateCategory?: (category: ICategory) => void;
  selectedCategory: ICategory | null;
  selectedTag?: ITag | null;
  setSelectedTag?: Dispatch<SetStateAction<ITag | null>>;
  bookmarks: IBookmark[];
  setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
  filteredCategories: ICategory[];
  setFilteredCategories: Dispatch<SetStateAction<ICategory[]>>;
  grouping: string;
};

/**
 * ContentBar component is responsible for rendering the content section of the application.
 * It includes a header, body, and footer, and manages the state of bookmarks and filtered categories.
 *
 * @component
 * @param {ContentBarProps} props - The properties passed to the component.
 * @param {Array} props.data - The data to be displayed.
 * @param {Object} props.selectedCategory - The currently selected category.
 * @param {Object} props.bookmarkToShow - The bookmark to be displayed.
 * @param {Function} props.setBookmarkToShow - Function to set the bookmark to be displayed.
 * @param {Object} props.selectedTag - The currently selected tag.
 * @param {Array} props.bookmarks - The list of bookmarks.
 * @param {Function} props.setBookmarks - Function to set the list of bookmarks.
 * @param {Function} props.setFilteredCategories - Function to set the filtered categories.
 * @param {Array} props.filteredCategories - The list of filtered categories.
 * @param {string} props.query - The search query.
 * @param {Function} props.setQuery - Function to set the search query.
 * @param {string} props.grouping - The grouping criteria.
 *
 * @returns {JSX.Element} The rendered ContentBar component.
 *
 * @example
 * <ContentBar
 *   data={data}
 *   selectedCategory={selectedCategory}
 *   bookmarkToShow={bookmarkToShow}
 *   setBookmarkToShow={setBookmarkToShow}
 *   selectedTag={selectedTag}
 *   bookmarks={bookmarks}
 *   setBookmarks={setBookmarks}
 *   setFilteredCategories={setFilteredCategories}
 *   filteredCategories={filteredCategories}
 *   query={query}
 *   setQuery={setQuery}
 *   grouping={grouping}
 * />
 */
export default function ContentBar(props: ContentBarProps) {
  const {
    data,
    setData,
    selectedCategory,
    selectedTag,
    bookmarks,
    setBookmarks,
    setFilteredCategories,
    filteredCategories,
    grouping,
  } = props;

  const sel = selectedCategory;

  useEffect(() => {
    /* CAUTION: the calls below is likely to cause infinite rendering */
    const x = sel ? data.filter((cat) => cat.id === sel.id) : data;
    setFilteredCategories(x);
    setBookmarks(getBookmarks(x));
  }, [selectedCategory, data, sel, setFilteredCategories, setBookmarks]);

  // console.log("Filtered Categories: ", data, filteredCategories);
  // console.log("Filtered Bookmarks: ", data, bookmarks);

  return (
    <article className="content mt-0">
      <ContentHeader
        selectedCategory={selectedCategory}
        filteredCategories={filteredCategories}
        setFilteredCategories={setFilteredCategories}
        bookmarks={bookmarks}
        setBookmarks={setBookmarks}
        grouping={grouping}
      />

      <ContentBody
        filteredCategories={filteredCategories}
        selectedTag={selectedTag}
        bookmarks={bookmarks}
        setBookmarks={setBookmarks}
        data={data}
        setData={setData}
        selectedCategory={selectedCategory}
      />
      <footer className="p-4 bg-gray-100 border-t border-gray-200">Content Footer</footer>
    </article>
  );
}
