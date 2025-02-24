import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { useState } from "react";
import { CiImport } from "react-icons/ci";
import { FaFileUpload } from "react-icons/fa";

export default function ImportPopover() {
    const [names, setNames] = useState<string[]>([]);
    const [isFileLoaded, setIsFileLoaded] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                if (Array.isArray(json) && json.every(item => typeof item === "string")) {
                    console.log(json);
                    setNames(json);
                    setIsFileLoaded(true);
                } else {
                    console.error("Invalid JSON format. Expected an array of strings.");
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        };
        reader.readAsText(file);
    };

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
                <PopoverPanel className="absolute z-10 mt-2 w-80 p-6 bg-white border border-gray-300 shadow-xl rounded-lg">
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
                                onClick={() => console.log("Adding all names")}
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
