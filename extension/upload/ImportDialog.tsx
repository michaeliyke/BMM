import { useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { Operator } from "../popup/data/operator";
import { useAppState } from "../popup/hooks/globalstate";
import { getAllBookmarks } from "../popup/utils/appState";
import { error } from "../popup/utils/functional.lib.dev";
import { ensureDataIntegrity, validateImport } from "../popup/utils/importExport";
import { IBMM } from "../popup/utils/types/schemas";


export default function ImportDialog() {
  const [newBmm, setNewBmm] = useState<IBMM | null>(null);
  const { feedAllStateComponents } = useAppState();

  /**
   * Integrates the imported data into the bmm structure for UI updates
   *
   * @param data the imported data
   */
  async function syncBMM(data: IBMM) {
    feedAllStateComponents(function (bmm) {
      bmm.bookmarks = [...bmm.bookmarks, ...data.bookmarks];
      bmm.categories = [...bmm.categories, ...data.categories];
      bmm.tags = [...bmm.tags, ...data.tags];

      bmm.bookmarkObjects = { ...bmm.bookmarkObjects, ...data.bookmarkObjects };
      bmm.categoryObjects = { ...bmm.categoryObjects, ...data.categoryObjects };
      bmm.tagObjects = { ...bmm.tagObjects, ...data.tagObjects };

      bmm.unlinked = { ...bmm.unlinked, ...data.unlinked };
      return bmm;
    });
  }

  /**
   * Parses the uploaded file, and returns a validated {@link IBMM} for processing
   *
   * @param file The uploaded file object
   * @returns Promise that resolves to the corresponding {@link IBMM} object
   */
  function readFileAsBMM(file: File) {
    return new Promise<IBMM>(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function loadHandler() {
        let data: IBMM;

        try {
          data = JSON.parse(reader.result as string);
        } catch (err) {
          throw new Error(`Error parsing JSON: ${err}`);
        }

        const errMessage = validateImport(data);
        if (errMessage)
          throw new Error(`Invalid data: ${errMessage}`);

        resolve(data);
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  /**
   * The entry point to the file upload experience
   * @param event The Event object
   */
  function load(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    readFileAsBMM(file)
      .then(ensureDataIntegrity) // ensures data consistency
      .then(updateLoadStates) // clear state flags
      .catch(error);
    /**
     * TODO: This problem about multiple import attempts, let's wait till the issues
     * becomes obvious! We can't solve it correctly until the pain points are clear
    */
  }

  /**
   * updates states relevant to file loading
   */
  function updateLoadStates(bmm: IBMM) {
    setNewBmm(bmm);
    return bmm;
  }

  /**
   * Syncs the verified data to {@link IBMM BMM} and IndexedDB
   *
   * @param bmm new {@link IBMM BMM}
   */
  async function integrate(bmm: IBMM) {
    await Operator.restoreBMMRecords(bmm);  // IndexedDB inserts
    syncBMM(bmm); // UI integration process
    setNewBmm(null);
    return bmm;
  }

  return <>
    {!newBmm ? (
      // First Screen: File Upload View
      <div className="flex flex-col w-full mt-10 items-center text-center space-y-4">
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center space-y-2">
          <FaFileUpload className="text-6xl text-green-700 hover:text-green-600 transition duration-200" />
          <p className="text-lg font-semibold text-gray-700">Upload JSON File</p>
          <p className="text-sm text-gray-500">Click to select a file</p>
        </label>
        <input
          type="file"
          id="file-upload"
          accept="application/json"
          className="hidden"
          onChange={load} />
      </div>
    ) : (
      // Second Screen: JSON Loaded View
      // Render imported Bookmarks
      <div className="space-y-2 text-center mb-2">
        <h2 className="text-xl font-semibold text-gray-800 text-center">Imported Names</h2>
        <hr />
        <ul className="max-h-60 overflow-y-auto px-10 text-center">
          {getAllBookmarks(newBmm).map(function (bookmark, index) {
            return <li key={index} className="text-gray-700 text-left border-b py-1">
              {bookmark.title}
            </li>
          })}
        </ul>
        <button
          type="button"
          className="rounded px-3 py-1.5 bg-green-600 text-white uppercase font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-300"
          onClick={() => integrate(newBmm)}
        >
          Add All
        </button>

      </div>
    )
    }
  </>
}


