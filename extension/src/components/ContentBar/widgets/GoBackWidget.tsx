import { Dispatch, SetStateAction } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IBookmark, ICategory, ITag } from "../../../utils/types/schemas";

type GoBackWidgetProps = {
    bookmarks: IBookmark[];
    setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
    filteredCategories: ICategory[];
    bookmarkToShow: IBookmark | null;
    setBookmarkToShow: (bookmark: IBookmark | null) => void;
    selectedTag?: ITag | null;
};

/**
 * GoBackWidget component renders a button that allows users to navigate back
 * to the previous view by setting the bookmark to show to null.
 *
 * @param {GoBackWidgetProps} props - The properties passed to the component.
 * @param {Function} props.setBookmarkToShow - Function to set the bookmark to show.
 *
 * @returns {JSX.Element} A button element that triggers the go back action.
 */
export function GoBackWidget(props: GoBackWidgetProps) {
    const { setBookmarkToShow } = props;
    function handleGoBack() {
        setBookmarkToShow(null);
    }

    return (
        <button
            onClick={handleGoBack}
            className="flex items-center text-sm text-blue-500 hover:text-blue-700 focus:outline-none transition"
        >
            <FaArrowLeft className="mr-2" />
            Go Back
        </button>
    );
}
