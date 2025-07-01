import { FaCommentDots } from "react-icons/fa";
import { useAppState } from "../../../hooks/globalstate";
import ItemFooter from "../ItemFooter";

/**
 * The body of the details view of a bookmark
 */
export default function Body() {
  const { bookmarkToShow } = useAppState();
  return <>
    {/* Description */}
    <section className="mb-6" aria-labelledby="description-heading">
      <h2
        id="description-heading"
        className="text-sm text-gray-500 text-center font-semibold mb-2"
      >
        {bookmarkToShow?.title}
      </h2>
      <p className="text-gray-700 text-sm/2 leading-relaxed">
        {bookmarkToShow?.description}
      </p>
    </section>

    {/* Notes/Comments Section */}
    <section aria-labelledby="notes-heading">
      <h2
        id="notes-heading"
        className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2"
      >
        <FaCommentDots className="text-blue-500" aria-hidden="true" />
        <span>Notes</span>
      </h2>
    </section>
    <hr className="my-3" />
    <ItemFooter />
  </>;
}
