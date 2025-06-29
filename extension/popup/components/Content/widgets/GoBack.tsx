import { FaArrowLeft } from "react-icons/fa";
import { useAppState } from "../../../hooks/globalstate";

/**
 * GoBackWidget component renders a button that allows users to navigate back
 * to the previous view by setting the bookmark to show to null.
 */
export default function GoBack() {
  const { setBookmarkToShow } = useAppState();

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
