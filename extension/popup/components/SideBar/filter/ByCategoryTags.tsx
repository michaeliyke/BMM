import { DebouncedFunc, debounce } from "lodash-es";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { FiChevronRight, FiHash, FiSearch } from "react-icons/fi";
import { PiTagSimpleFill } from "react-icons/pi";
import { useAppState } from "../../../hooks/globalstate";
import { categoryTagsSearch, sortedCategories, toggleHighlightedClass } from "../../../utils/common";
import { ICategory, ITag } from "../../../utils/types/schemas";

type DSI = Dispatch<SetStateAction<ICategory[]>>;
type CL = ICategory[];

export function ByCategoryTags() {

  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean; }>({});
  const [query, setQuery] = useState<string>('');
  const [_categories, setCategories] = useState<ICategory[]>([]);
  const [hasExecuted, setHasExecuted] = useState<boolean>(false);
  const {
    setBookmarkToShow,
    selectedTag,
    setSelectedTag,
    selectedCategory,
    setSelectedCategory,
    defaultCategory,
    setGrouping,
    data,
  } = useAppState();

  function toggleExpand(category: ICategory) {
    setExpandedCategories((prev) => {
      const temp = { ...prev, [category.id]: !prev[category.id] };
      return temp;
    });
  }

  function toggleSelectedTag(tag: ITag, event: React.MouseEvent<HTMLElement>) {
    const target = event.currentTarget;
    setSelectedTag(tag);
    setBookmarkToShow(null); /* Allow this later */

    // Update the category text in the header
    toggleHighlightedClass(target, "tag");
    if (selectedCategory)
      setGrouping(selectedCategory.name + (tag ? ` # ${tag.name}` : ''));
  }


  function toggleSelected(category: ICategory, target: HTMLElement) {
    if (category) {
      setSelectedCategory(category.is_default !== 1 ? category : null);
      setBookmarkToShow(null);
      setSelectedTag(null);
      // Update the category text in the header
      setGrouping(category.name + (selectedTag ? ` # ${selectedTag.name}` : ''));
      toggleHighlightedClass(target);
    }
  }


  /**
   * A reference to a debounced search function.
   * This reference is used to store a debounced version of a search function
   * that takes a string query as an argument. The debounced function will delay
   * the execution of the search function to optimize performance and reduce the
   * number of search requests made.
   *
   * @type {React.MutableRefObject<DebouncedFunc<(q: string) => void> | null>}
   */
  const searchFnRef = useRef<DebouncedFunc<(q: string) => void> | null>(null);

  /**
   * Debounced search function to filter categories based on a query string.
   *
   * @param query - The search query string.
   * @param categoryList - The list of categories to filter from.
   * @param setCategories - The state setter function to update the filtered categories.
   *
   * This function uses a debounced approach to limit the frequency of search executions.
   * It ensures that the search function is called at most once every 300 milliseconds.
   */
  const search = useCallback((query: string, categories: CL, setCategories: DSI) => {
    if (!searchFnRef.current)
      searchFnRef.current = debounce(performSearch, 300);

    searchFnRef.current(query);

    function performSearch(q: string) {
      setCategories(categoryTagsSearch(q, categories));
      setHasExecuted(true);
    }
  }, []);

  /**
   * Handles the search input change event.
   * Updates the query state and triggers a debounced search.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  function handleSearch(query: string) {
    setQuery(query);
    search(query, data, setCategories);
  }

  useEffect(() => {
    // Set the default category text in the header
    const category = selectedCategory || defaultCategory;
    setGrouping(category.name + (selectedTag ? ` # ${selectedTag.name}` : ''));

    if (!query)
      setCategories(data);

    return () => {
      // Cancel the debounced search function when the component unmounts.
      if (searchFnRef.current && hasExecuted) {
        searchFnRef.current.cancel();
        setHasExecuted(false);
      }
    };
  }, [defaultCategory, setGrouping, selectedTag, selectedCategory, data, query, setCategories, hasExecuted]);


  return (
    <section className="filtered-list w-full h-full overflow-y-auto">
      {/* Search Bar */}
      <label htmlFor="category-tags-search" className="sr-only">
        Search Category Tags
      </label>
      <form role="search" className="relative px-4 py-3 border-b border-gray-200">
        <FiSearch
          aria-hidden="true"
          className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
        />
        <input
          id="category-tags-search"
          type="search"
          onChange={(e) => handleSearch(e.currentTarget.value)}
          value={query}
          placeholder="Search Category tags"
          className="w-full pl-8 pr-3 py-1.5 text-xs text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-100"
          aria-label="Search category tags"
        />
      </form>
      <ul className="categories">
        {sortedCategories(_categories).map((category, index) => (
          <li
            key={index}
            className=""
            data-category={category.name}
            data-id={category.id}
            data-default={category.is_default}
          >
            <div
              className={`category flex items-center justify-start px-4 py-2 text-xs text-gray-700 font-medium cursor-pointer hover:bg-slate-50 ${category.is_default === 1 ? 'highlighted' : ''}`}
              onClick={((e) => {
                toggleSelected(category, e.currentTarget);
                if (category.is_default !== 1)
                  toggleExpand(category);
              })}
            >
              <PiTagSimpleFill className="mr-2 text-gray-500" />
              <span>{category.name}</span>
              {category.is_default === 1
                ? <FiChevronRight className="text-lg text-gray-300 ml-auto" />
                : <FiChevronRight className={`text-lg ml-auto text-blue-500 transition-transform ${expandedCategories[category.id] ? 'rotate-90' : ''}`} />}
            </div>
            {expandedCategories[category.id] && category.tags.length > 0 && (
              <ul className="tags ml-8 mt-2 space-y-1">
                {category.tags.map((tag, tagIndex) => (
                  <li
                    key={tagIndex}
                    className="tag flex items-center px-4 py-1 text-xs text-gray-500 hover:bg-slate-50 rounded-md cursor-pointer"
                    onClick={(event) => toggleSelectedTag(tag, event)}
                  >
                    <FiHash className="mr-0.5 text-xs text-gray-400" />
                    <span>{tag.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
