
import { Dispatch, SetStateAction, useEffect } from "react";
import { useAppState } from "../../hooks/globalstate";
import { getBookmarks } from "../../utils/common";
import { ICategory } from "../../utils/types/schemas";
import ContentBody from "./ContentBody";
import ContentHeader from "./ContentHeader";

type ContentBarProps = {
  data: ICategory[];
  setData: Dispatch<SetStateAction<ICategory[]>>;
  updateCategory?: (category: ICategory) => void;
};

/**
 * ContentBar component is responsible for rendering the content section of the application.
 * It includes a header, body, and footer, and manages the state of bookmarks and filtered categories.
 */
export default function ContentBar(props: ContentBarProps) {
  const { data, setData } = props;
  const {
    selectedCategory,
    setFilteredCategories,
    setBookmarks,
  } = useAppState();

  const sel = selectedCategory;

  useEffect(() => {
    /* CAUTION: the calls below is likely to cause infinite rendering */
    const x = sel ? data.filter((cat) => cat.id === sel.id) : data;
    setFilteredCategories(x);
    setBookmarks(getBookmarks(x));
  }, [selectedCategory, data, sel, setFilteredCategories, setBookmarks]);

  return (
    <article className="content mt-0">
      <ContentHeader />

      <ContentBody data={data} setData={setData} />
      <footer className="p-4 bg-gray-100 border-t border-gray-200">Content Footer</footer>
    </article>
  );
}
