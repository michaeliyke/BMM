import { Dispatch, SetStateAction, useState } from "react";
import { useAppState } from "../../../hooks/globalstate";
import Body from "./body";
import CategoryTab from "./CategoryTab";
import EditForm from "./EditForm";
import Header from "./Header";

type BookmarkViewProps = {
  showDetails: boolean;
  setShowDetails: Dispatch<SetStateAction<boolean>>;
};


/**
 * Displays the details view of a selected bookmark.
 * It allows users to view and edit the bookmark information.
 */
export default function BookmarkView(props: BookmarkViewProps) {
  const { showDetails, setShowDetails } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { bookmarkToShow: bookmark } = useAppState();

  /**
   * Handles the edit action by setting the editing state to true.
   * This function is typically called when the user initiates an edit operation.
   */
  function initiateEditing() {
    setIsEditing(true);
  }


  if (!bookmark) {
    return <p>No bookmark selected</p>;
  }

  const categories = [
    'Category 1',
    'Category 2',
    'Category 3',
    'Category 4',
    'Category 5',
    'Category 6',
    'Category 7',
    'Category 8',
    'Category 9',
    'Category 10',

  ]

  return (
    isEditing ?
      <EditForm
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      /> :
      <section className="grid grid-cols-1 gap-2 p-6 bg-gray-50">
        <article
          className="max-w-4xl p-6 pt-2 bg-white shadow-lg rounded-lg border border-gray-200"
          aria-labelledby="bookmark-title"
        >
          {/* Header sectiom*/}
          <Header
            bookmark={bookmark}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
            initiateEditing={initiateEditing}
          />

          {/* Details section and the categories tab */}
          {showDetails
            ? <Body bookmark={bookmark} />
            : <CategoryTab categories={categories} />
          }
        </article>
      </section >
  );
}


