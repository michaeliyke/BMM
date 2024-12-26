
import { ContentBarProps } from "../../utils/types/commons";
import BookmarksDisplay from "./BookmarksDisplay";
import GoBackButton from "./WidgetGoBack";

export default function ContentBar(props: ContentBarProps) {
    const {
        data,
        selectedCategory,
        bookmarkToShow,
        setBookmarkToShow,
    } = props;

    const filteredCategories = selectedCategory ? data.filter((cat) => cat.id === selectedCategory.id) : data;

    return (
        <article className="content">
            <header className="flex justify-between items-center mt-4 p-4 bg-gray-100 border-b border-gray-200">
                {bookmarkToShow &&
                    <GoBackButton
                        categories={filteredCategories}
                        bookmarkToShow={bookmarkToShow}
                        setBookmarkToShow={setBookmarkToShow}
                    ></GoBackButton>}
                <h1 className="text-lg font-semibold text-gray-800">Content Header</h1>
            </header>
            <BookmarksDisplay
                categories={filteredCategories}
                bookmarkToShow={bookmarkToShow}
                setBookmarkToShow={setBookmarkToShow}
            />
            <footer className="p-4 bg-gray-100 border-t border-gray-200">Content Footer</footer>
        </article>
    );
}
