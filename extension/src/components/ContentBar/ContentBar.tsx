
import { useEffect } from "react";
import { useAppState } from "../../hooks/globalstate";
import { getBookmarks } from "../../utils/common";
import ContentBody from "./ContentBody";
import ContentHeader from "./ContentHeader";

/**
 * ContentBar component is responsible for rendering the content section of the application.
 * It includes a header, body, and footer, and manages the state of bookmarks and filtered categories.
 */
export default function ContentBar() {
  const {
    selectedCategory,
    setFilteredCategories,
    setBookmarks,
    data,
  } = useAppState();

  const sel = selectedCategory;

  useEffect(() => {
    /* CAUTION: the calls below is likely to cause infinite rendering */
    const x = sel ? data.filter((cat) => cat.id === sel.id) : data;
    setFilteredCategories(x);
    setBookmarks(getBookmarks(x));
  }, [selectedCategory, data, sel, setFilteredCategories, setBookmarks]);

  return (
    <article className="content mt-0 border-l border-r border-gray-200 shadow-sm">
      <ContentHeader />

      <ContentBody />
      <footer className="p-4 bg-gray-100 border-t border-gray-200">Content Footer</footer>
    </article>
  );
}
