import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { CiImport } from "react-icons/ci";
import { getBookmarks } from "../../../utils/common";
import { ICategory } from "../../../utils/types/schemas";

type IPProps = {
  categories: ICategory[];
}

export default function ImportPopover(props: IPProps) {
  const names = getBookmarks(props.categories)
    .map(bookmark => bookmark.title);

  function exportBookmarks() {
    const json = JSON.stringify(props.categories, null, 4);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "bookmarks.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Popover className="relative">
      <PopoverButton className="py-2 pr-3 pl-1 rounded-lg tracking-wide border border-green-700 text-green-700 focus:ring-2 focus:ring-green-50 flex items-center">
        <CiImport className="mr-1" />
        Export it
      </PopoverButton>

      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <PopoverPanel className="absolute z-10 mt-2 w-80 p-6 bg-white border border-gray-300 shadow-xl rounded-lg">

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 text-center">Exported Names</h2>
            <hr />
            <ul className="max-h-48 overflow-y-auto space-y-2 text-left">
              {names.map((name, index) => (
                <li key={index} className="text-gray-700 border-b py-1">
                  {name}
                </li>
              ))}
            </ul>
            <hr />
            <button
              type="button"
              className="w-full py-2 rounded-lg bg-green-600 text-white text-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-300"
              onClick={exportBookmarks}
            >
              Export Bookmarks
            </button>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
