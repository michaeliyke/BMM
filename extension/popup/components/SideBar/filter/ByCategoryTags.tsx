import { DebouncedFunc, debounce } from "lodash-es";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { FiChevronRight, FiHash, FiSearch } from "react-icons/fi";
import { PiTagSimpleFill } from "react-icons/pi";
import { defaultCategory } from "../../../data/data";
import { useAppState } from "../../../hooks/globalstate";
import { getAllTags, getCategoryTags } from "../../../utils/appState";
import { highlightTarget, sortedCategories } from "../../../utils/common";
import { log } from "../../../utils/functional.lib.dev";
import { ICategory, IDMap, ITag } from "../../../utils/types/schemas";

type DSI = Dispatch<SetStateAction<ICategory[]>>;
type CL = ICategory[];

export function ByCategoryTags() {
  const {
    setBookmarkToShow,
    selectedTag,
    setSelectedTag,
    selectedCategory,
    setSelectedCategory,
    setGrouping,
    categories,
    bmm,
  } = useAppState();

  const [expandedCategories, setExpandedCategories] = useState<IDMap<boolean>>({});
  const [query, setQuery] = useState<string>('');
  const [_categories, setCategories] = useState<ICategory[]>([]);
  const [hasExecuted, setHasExecuted] = useState<boolean>(false);


  function categoryTagsSearch(s: string, d: CL): ICategory[] {
    log(s, d);
    return [];
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
    search(query, categories, setCategories);
  }

  /**
   * 1. Resets the showing bookmark in order to display a list of bookmarks
   * 2. Updates the category-tag indicator text
   * 3. Removes highlighting from the previously highlighted and sets it on this category
   *
   * @param category The clicked category
   * @param e Event object
   */
  function categoryClick(category: ICategory, e: React.MouseEvent<HTMLElement>) {
    setBookmarkToShow(null);
    setSelectedTag(null);
    highlightTarget(e.currentTarget);

    setSelectedCategory(category.is_default === 1 ? null : category);
    setExpandedCategories((s) => ({ ...s, [category.id]: !s[category.id] }));
  }

  /**
   * 1. Removes previous highlighting and and sets it on the clicked tag.
   * 2. Resets the showing bookmark in order to show list of bookmarks
   * 3. Updates the category-tag indicator text
   *
   * @param category The category whose tag is clicked
   * @param tag The clicked tag
   * @param e Event object
   */
  function categoryTagClick(category: ICategory, tag: ITag, e: React.MouseEvent<HTMLElement>) {
    setSelectedTag(tag);
    setBookmarkToShow(null);
    highlightTarget(e.currentTarget, "tag");
    setSelectedCategory(category.is_default === 1 ? null : category);
  }

  // Runs once only during page load because the dependency array is empty
  useEffect(function () {
    setSelectedCategory(defaultCategory);
    setSelectedTag(null);
  }, []);

  useEffect(function () {
    setCategories(categories);

    return function () {
      // Cancel the debounced search function when the component unmounts.
      if (searchFnRef.current && hasExecuted) {
        searchFnRef.current.cancel();
        setHasExecuted(false);
      }
    };
  }, [
    setGrouping, selectedTag, selectedCategory, categories, query,
    setCategories, hasExecuted,
  ]);


  return (
    <section className="filtered-list w-full h-full overflow-y-auto">
      {/* Search Bar */}
      <label htmlFor="category-tags-search" className="sr-only">
        Search Category Tags
      </label>

      {/* The search form */}
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
        {/* Default Category*/}
        <li
          key={defaultCategory.id}
          className=""
          data-category={defaultCategory.name}
          data-id={defaultCategory.id}
          data-default={defaultCategory.is_default}
        >
          <div
            className={`category flex items-center justify-start px-4 py-2 text-xs text-gray-700 font-medium cursor-pointer hover:bg-slate-50 ${defaultCategory.is_default === 1 ? 'highlighted' : ''}`}
            onClick={(e) => categoryClick(defaultCategory, e)}
          >
            <PiTagSimpleFill className="mr-2 text-gray-500" />
            <span>{defaultCategory.name}</span>
            {<FiChevronRight className={`text-lg ml-auto text-blue-500 transition-transform ${expandedCategories[defaultCategory.id] ? 'rotate-90' : ''}`} />}
          </div>
          {expandedCategories[defaultCategory.id] && (
            <ul className="tags ml-8 mt-2 space-y-1">
              {(getAllTags(bmm)).map((tag, tagIndex) => (
                <li
                  key={tagIndex}
                  className="tag flex items-center px-4 py-1 text-xs text-gray-500 hover:bg-slate-50 rounded-md cursor-pointer"
                  onClick={(event) => categoryTagClick(defaultCategory, tag, event)}
                >
                  <FiHash className="mr-0.5 text-xs text-gray-400" />
                  <span>{tag.name}</span>
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* Regular categores */}
        {sortedCategories(_categories).map(function renderCategory(category, catIndex) {
          return <li
            key={catIndex}
            className=""
            data-category={category.name}
            data-id={category.id}
            data-default={category.is_default}
          >
            <div
              className="category flex items-center justify-start px-4 py-2 text-xs text-gray-700 font-medium cursor-pointer hover:bg-slate-50"
              onClick={(e) => categoryClick(category, e)}
            >
              <PiTagSimpleFill className="mr-2 text-gray-500" />
              <span>{category.name}</span>
              {<FiChevronRight className={`text-lg ml-auto text-blue-500 transition-transform ${expandedCategories[category.id] ? 'rotate-90' : ''}`} />}
            </div>
            {expandedCategories[category.id] && category.tagIds.length > 0 && (
              <ul className="tags ml-8 mt-2 space-y-1">
                {getCategoryTags(bmm, category.id).map(function renderTag(tag, tagIndex) {
                  return <li
                    key={tagIndex}
                    className="tag flex items-center px-4 py-1 text-xs text-gray-500 hover:bg-slate-50 rounded-md cursor-pointer"
                    onClick={(event) => categoryTagClick(category, tag, event)}
                  >
                    <FiHash className="mr-0.5 text-xs text-gray-400" />
                    <span>{tag.name}</span>
                  </li>
                })}
              </ul>
            )}
          </li>
        })}
      </ul>


    </section>
  );
}
