import { useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { useAppState } from "../popup/hooks/globalstate";
import { getBookmarks } from "../popup/utils/common";
import { getImportHandler, isImportData, validateImported } from "../popup/utils/importExport";
import { IBookmark, ICategory, ImportData } from "../popup/utils/types/schemas";


export default function ImportDialog() {
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [importData, setImportData] = useState<ImportData>([]);
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
  const { setData } = useAppState();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function importFileLoader(e: ProgressEvent<FileReader>) {
      try {
        const data = JSON.parse(e.target?.result as string);
        // importType prop must be present: "bookmark" or "category"
        if (!isImportData(data))
          throw new Error("Invalid JSON format. Expected an array of bookmarks or categories.");
        setImportData(data); // Data to be imported
        await validateImported(data); // Mark existsing items as existsing
        // For displaying the imported bookmarks
        setBookmarks(getBookmarks(data as ICategory[]));
        setIsFileLoaded(true);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(file);
  }
  return <>
    {!isFileLoaded ? (
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
          onChange={handleFileChange} />
      </div>
    ) : (
      // Second Screen: JSON Loaded View
      // Render imported Bookmarks
      <div className="space-y-2 text-center mb-2">
        <h2 className="text-xl font-semibold text-gray-800 text-center">Imported Names</h2>
        <hr />
        <ul className="max-h-60 overflow-y-auto px-10 text-center">
          {bookmarks.map((bookmark, index) => (
            <li key={index} className="text-gray-700 text-left border-b py-1">
              {bookmark.title}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="rounded px-3 py-1.5 bg-green-600 text-white uppercase font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-300"
          onClick={getImportHandler(importData, setData)}
        >
          Add All
        </button>

      </div>
    )
    }
  </>
}


