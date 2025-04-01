import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import ContentBar from '../components/ContentBar/ContentBar'
import Header from '../components/HeaderBar/Header'
import SideBar from '../components/SideBar/SideBar'
import { IBookmark, ICategory, ITag } from '../utils/types/schemas'
import { useAppState } from '../hooks/globalstate'


export type IHomeProps = {
  data: ICategory[];
  setData: Dispatch<SetStateAction<ICategory[]>>;
}

const _defaultCategory = {
  id: 'dummy-id',
  name: 'No Category Selected',
  is_default: 0,
  created_at: (new Date()).toUTCString(),
  updated_at: (new Date()).toUTCString(),
  tags: [],
  bookmarks: []
};


/**
 * The `Home` component is the main page of the application. It manages the state and interactions
 * for displaying and filtering categories, bookmarks, and tags. It also handles the default category
 * and updates to categories.
 *
 * @param {IHomeProps} props - The properties passed to the component.
 * @param {ICategory[]} props.data - The list of categories.
 * @param {React.Dispatch<React.SetStateAction<ICategory[]>>} props.setData - The function to update the list of categories.
 *
 * @returns {JSX.Element} The rendered Home component.
 *
 * @component
 * @example
 * return (
 *   <Home data={data} setData={setData} />
 * )
 */
export default function Home(props: IHomeProps) {
  const { data, setData } = props;
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [defaultCategory, setDefaultCategory] = useState<ICategory>(_defaultCategory);
  const [bookmarkToShow, setBookmarkToShow] = useState<IBookmark | null>(null);
  const [selectedTag, setSelectedTag] = useState<ITag | null>(null);
  const [grouping, setGrouping] = useState(
    (selectedCategory || defaultCategory).name +
    (selectedTag ? ` # ${selectedTag.name}` : '')
  );
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);
  const [bookmarks, setBookmarksRaw] = useState<IBookmark[]>([]);
  // query: cleared in Sidebar header and, set and used in Content SearchWidget
  const { headerForm } = useAppState();

  // Wrapper function to for setBookmarks: filter out archived bookmarks
  const setBookmarks = useCallback((bookmarks: SetStateAction<IBookmark[]>): void => {
    // Use a map to ensure that the bookmarks are unique
    setBookmarksRaw((prev) => {
      const uniqueBookmarks = new Map<string, IBookmark>();
      return (bookmarks instanceof Function ? bookmarks(prev) : bookmarks)
        .filter((bookmark) => {
          if (bookmark.archived === 1 || uniqueBookmarks.has(bookmark.id)) {
            return false;
          }
          uniqueBookmarks.set(bookmark.id, bookmark);
          return true;
        });
    });

  }, []);




  useEffect(() => {
    for (const category of data) {
      if (category.is_default === 1) {
        setDefaultCategory(category);
      }
    }
  }, [data]);

  return (
    <>
      <Header
        selectedCategory={selectedCategory}
        setData={setData}
        categories={data}
        defaultCategory={defaultCategory}
        grouping={grouping}
        setGrouping={setGrouping}
        selectedTag={selectedTag}
      />

      <section className={headerForm ? `pt-[128px]` : ''}>
        <SideBar
          props={{
            categories: data,
            setData,
            selectedCategory,
            setSelectedCategory,
            defaultCategory,
            bookmarkToShow,
            setBookmarkToShow,
            selectedTag,
            setSelectedTag,
            setGrouping,
            bookmarks,
            setBookmarks,
            filteredCategories,
            setFilteredCategories,
          }}
        />

        <ContentBar
          selectedCategory={selectedCategory}
          data={data}
          setData={setData}
          bookmarkToShow={bookmarkToShow}
          setBookmarkToShow={setBookmarkToShow}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          filteredCategories={filteredCategories}
          setFilteredCategories={setFilteredCategories}
          grouping={grouping}
        />
      </section>
    </>
  )
}
