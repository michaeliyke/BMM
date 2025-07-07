import { CiImport } from "react-icons/ci";
import { showChromePopup } from "../../../utils/common";
import { error } from "../../../utils/functional.lib.dev";

export default function ButtonExtension() {
  function luanchPopup() {
    showChromePopup("/upload/index.html")
      .catch(error)
  }

  return (<div className="flex items-center">
    <button
      className="py-2 px-4 rounded-lg tracking-wide border border-blue-700 text-blue-700 flex items-center"
      onClick={luanchPopup}
      title="import bookmarks"
    >
      <CiImport className="mr-1" />
      Import
    </button>
  </div>);
}
