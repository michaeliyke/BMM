import { BookmarksDisplayProps } from "../../utils/types/commons";
import BookmarkDetails from "./BookmarkDetails";
import ShowBookmarks from "./ShowBookmarks";

export default function BookmarksDisplay(props: BookmarksDisplayProps) {
    const {
        categories,
        bookmarkToShow,
        setBookmarkToShow,
    } = props;

    // We will show all bookmarks if:
    //  showAll is true
    //  bookmarkToShow is null
    // selectedCategory changes

    const whatToShow = bookmarkToShow ?
        <BookmarkDetails
            categories={categories}
            bookmarkToShow={bookmarkToShow}
            setBookmarkToShow={setBookmarkToShow}
        /> :
        <ShowBookmarks
            categories={categories}
            bookmarkToShow={bookmarkToShow}
            setBookmarkToShow={setBookmarkToShow}
        />;
    return <>{whatToShow}</>;
}
