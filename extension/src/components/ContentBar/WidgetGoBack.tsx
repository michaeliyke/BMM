import { FaArrowLeft } from "react-icons/fa";
import { BookmarksDisplayProps } from "../../utils/types/props";
export default function GoBackButton(props: BookmarksDisplayProps) {
    const { setBookmarkToShow } = props;
    const handleGoBack = () => {
        console.log("Go Back button clicked");
        setBookmarkToShow(null);
    };

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
