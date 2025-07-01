import { useState } from "react";
import Body from "./body";
import CategoryTab from "./CategoryTab";
import EditForm from "./EditForm";
import Header from "./Header";

/**
 * Displays the details view of a selected bookmark.
 * It allows users to view and edit the bookmark information.
 */
export default function Bookmark() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(true);

  /**
   * Handles the edit action by setting the editing state to true.
   * This function is typically called when the user initiates an edit operation.
   */
  function initiateEditing() {
    setIsEditing(true);
  }

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
            showDetails={showDetails}
            setShowDetails={setShowDetails}
            initiateEditing={initiateEditing}
          />

          {/* Details section and the categories tab */}
          {showDetails
            ? <Body />
            : <CategoryTab />
          }
        </article>
      </section >
  );
}


