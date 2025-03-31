import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { useState } from "react";
import { CiImport } from "react-icons/ci";
import { FaFileUpload } from "react-icons/fa";
import { getBookmarks } from "../../utils/common";
import { getImportHandler, isImportData, validateImported } from "../../utils/importExport";
import { IBookmark, ICategory, ImportData } from "../../utils/types/schemas";

type IPProps = {
  setData: React.Dispatch<React.SetStateAction<ICategory[]>>;
}

export default function ImportDialog(props: IPProps) {
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [importData, setImportData] = useState<ImportData>([]);
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
  const { setData } = props;

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

  return (
    <Popover className="relative">
      <PopoverButton className="py-2 px-4 rounded-lg tracking-wide border border-green-700 text-green-700 hover:bg-green-100 focus:ring-2 focus:ring-green-50 flex items-center">
        <CiImport className="mr-1" />
        Import
      </PopoverButton>

      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <PopoverPanel className="absolute z-10 -mt-8 w-80 p-6 -left-20 bg-white border border-gray-300 shadow-xl rounded-lg">
          {!isFileLoaded ? (
            // First Screen: File Upload View
            <div className="flex flex-col items-center text-center space-y-4">
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
                onChange={handleFileChange}
              />
            </div>
          ) : (
            // Second Screen: JSON Loaded View
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 text-center">Imported Names</h2>
              <hr />
              <ul className="max-h-48 overflow-y-auto space-y-2 text-center">
                {bookmarks.map((bookmark, index) => (
                  <li key={index} className="text-gray-700 text-left border-b py-1">
                    {bookmark.title}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="w-full py-1.5 bg-green-600 text-white uppercase font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-300"
                onClick={getImportHandler(importData, setData)}
              >
                Add All
              </button>

            </div>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}


