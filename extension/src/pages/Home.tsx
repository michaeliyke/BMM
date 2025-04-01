import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import ContentBar from '../components/ContentBar/ContentBar'
import Header from '../components/HeaderBar/Header'
import SideBar from '../components/SideBar/SideBar'
import { IBookmark, ICategory } from '../utils/types/schemas'
import { useAppState } from '../hooks/globalstate'


export type IHomeProps = {
  data: ICategory[];
  setData: Dispatch<SetStateAction<ICategory[]>>;
}

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
  const {
    headerForm,
    selectedCategory,
    selectedTag,
    defaultCategory,
    setDefaultCategory,
  } = useAppState();
  const [grouping, setGrouping] = useState(
    (selectedCategory || defaultCategory).name +
    (selectedTag ? ` # ${selectedTag.name}` : '')
  );
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);
  const [bookmarks, setBookmarksRaw] = useState<IBookmark[]>([]);
  // query: cleared in Sidebar header and, set and used in Content SearchWidget

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
  }, [data, setDefaultCategory]);

  return (
    <>
      <Header
        setData={setData}
        categories={data}
        grouping={grouping}
        setGrouping={setGrouping}
      />

      <section className={headerForm ? `pt-[128px]` : ''}>
        <SideBar
          props={{
            categories: data,
            setData,
            setGrouping,
            bookmarks,
            setBookmarks,
            filteredCategories,
            setFilteredCategories,
          }}
        />

        <ContentBar
          data={data}
          setData={setData}
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
