import { Dispatch, SetStateAction, useState } from "react";
import Bookmark from "../../data/adapters/bookmark";
import { useAppState } from "../../hooks/globalstate";


export interface BookmarkEditFormProps {
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

/**
 * BookmarkEditForm component allows users to edit the details of a bookmark.
 */
export function BookmarkEditForm(props: BookmarkEditFormProps) {
  const { setIsEditing } = props;
  const { bookmarkToShow } = useAppState();
  const bookmark = bookmarkToShow!; // Non-null assertion operator to assert not null
  const [title, setTitle] = useState<string>(bookmark.title);
  const [url, setUrl] = useState<string>(bookmark.url);
  const [description, setDescription] = useState<string>(bookmark.description);

  /**
   * Handles the update of bookmark details.
   *
   * @param {IBookmark} updatedDetails - The updated details of the bookmark.
   * @returns {void}
   */
  function applyUpdate(e: React.FormEvent) {
    e.preventDefault();
    const modification = { ...bookmark, title, url, description };

    (new Bookmark(modification)).update().then(() => {
      // setData((state: ICategory[]) => {
      //   const newState = [...state]; // shallow copy of the state array

      //   const categoryIndex = newState.findIndex((c) => { // If any returns true
      //     return c.bookmarks.some((b) => b.id === bookmark.id);
      //   });

      //   if (categoryIndex === -1) return state; // Safety checks

      //   const bookmarkIndex = newState[categoryIndex].bookmarks.findIndex((b) => b.id === bookmark.id);
      //   if (bookmarkIndex === -1) return state; // Safety checks

      //   newState[categoryIndex].bookmarks[bookmarkIndex] = modification;
      //   // console.log("Bookmark updated successfully", modification);
      //   setIsEditing(false);
      //   return newState; // Return the new state
      // });

    })
      .catch((error) => {
        console.error("Error updating bookmark", error);
      });
  }

  /**
   * Handles the cancel action by setting the editing state to false.
   * This function is typically called when the user cancels an edit operation.
   */
  function cancelUpdate() {
    setIsEditing(false);
  }

  return (
    <section className="grid grid-cols-1 gap-2 p-6 bg-gray-50">
      <article
        className="max-w-4xl mx-aut-o p-6 bg-white shadow-lg rounded-lg border border-gray-200"
        aria-labelledby="edit-bookmark-title"
      >
        <section className="space-y-6">
          <h2
            id="edit-bookmark-title"
            className="text-xl font-bold text-gray-800 border-b pb-2"
          >
            Edit Bookmark
          </h2>
          <form onSubmit={applyUpdate} className="space-y-5 bg-gray-50 p-5 rounded-md border border-gray-300">
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </legend>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                required />
            </fieldset>

            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </legend>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                required />
            </fieldset>

            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </legend>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                rows={4}
              ></textarea>
            </fieldset>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={cancelUpdate}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
              >
                Update Details
              </button>
            </div>
          </form>
        </section>
      </article>
    </section>
  );
}
