import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import React from "react";
import { FiChevronDown } from "react-icons/fi";
import { v4 as uuid4 } from "uuid";
import Bookmark from "../../data/adapters/bookmark";
import { useAppState } from "../../hooks/globalstate";
import { cutStr } from "../../utils/common";
import { ITab } from "../../utils/types/schemas";

interface IAAWidgetProps {
  tabs: ITab[];
  setTabs: React.Dispatch<React.SetStateAction<ITab[]>>;
}

export default function AddAllWidget({ tabs, setTabs }: IAAWidgetProps) {
  const { setBookmarks, bookmarks } = useAppState();
  function handleCheckboxChange(_: React.ChangeEvent<HTMLInputElement>, index: number) {
    setTabs((prevTabs) => {
      return prevTabs.map((tab, i) => {
        if (i !== index) return tab;
        return { ...tab, checked: !tab.checked };
      });
    });

  };

  function skipExisting(tab: ITab) {
    // Check if the tab URL already exists in bookmarks
    const exists = bookmarks.some((bookmark) => bookmark.url === tab.url);
    if (exists) {
      console.log("Bookmark already exists for URL:", tab.url);
      return false; // Skip this tab
    }
    return true; // Include this tab
  }

  function skipTests(tab: ITab) {
    // Skip creating if url starts with "http://example.com"
    // get the domain name from the url
    const domain = new URL(tab.url).hostname;
    // Check if the domain is in the list of test domains
    const testDomains = ["example.com", "test.com"];
    if (testDomains.includes(domain)) {
      console.log("Skipping test URL:", tab.url);
      return false; // Skip this tab
    }
    return true; // Include this tab
  }

  function skipUnchecked(tab: ITab) {
    // Skip unchecked tabs
    if (!tab.checked) {
      console.log("Skipping unchecked tab:", tab.url);
      return false; // Skip this tab
    }
    return true; // Include this tab
  }

  function handleAddAll() {
    for (const tab of tabs.filter(skipUnchecked).filter(skipTests).filter(skipExisting)) {
      // Skip creating if url starts with "http://example.com"
      const bookmark = new Bookmark({
        id: uuid4(),
        title: tab.title,
        url: tab.url,
        description: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        archived: 0,
        tagIds: [],
        categoryIds: [],
      });
      bookmark.create().then((res) => {
        setBookmarks((prev) => [...prev, res]);
        setTabs((prev) => prev.filter((t) => ({ ...t, checked: false })));
        console.log("Bookmark created:", res);
      }).catch((err) => {
        console.error("Error creating bookmark:", err);
      });
    }
  };

  return (
    <div className="relative flex items-center">
      {/* Main Button (Independent Click Handler) */}
      <button
        onClick={handleAddAll}
        type="button"
        className="py-2 px-4 rounded-l-full tracking-wide bg-blue-500 text-white hover:bg-blue-600 flex items-center"
      >
        Add all tabs
      </button>

      {/* Dropdown Trigger (Unified with Main Button) */}
      <Menu as="div" className="relative">
        <MenuButton className="p-1 rounded-r-full bg-blue-500 hover:bg-blue-600 text-white border-l border-blue-400 flex items-center justify-center">
          <FiChevronDown className="w-5 h-5" />
        </MenuButton>

        {/* Dropdown Menu */}
        <MenuItems className="absolute right-0 pt-2 z-10 mt-2 w-80 max-h-60 overflow-y-auto border border-gray-200 rounded-lg shadow-sm bg-white focus:outline-none">
          {tabs.map((tab, i) => {
            return (
              <div
                key={i}
                className="flex justify-between items-center pl-3 pr-4 py-2 border-b last:border-b-0">
                <div className="inline-block">{cutStr(tab.url, 40)}</div>
                <input
                  type="checkbox"
                  checked={tab.checked}
                  className="w-4"
                  onChange={(e) => handleCheckboxChange(e, i)}
                />
              </div>
            );
          })}
          <MenuItem as="div" className="p-2">
            {({ close }) => (
              <button
                type="button"
                onClick={() => {
                  handleAddAll();
                  close();
                }}
                className="w-full py-2 px-4 rounded-full tracking-wide bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-300"
              >
                Add all
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}
