import { isChromeExtension } from "../../../utils/common";
import ChromeImportDialog from "./ChromeImportDialog";
import RegularImportDialog from "./RegularImportDialog";

export default function ImportWidget() {
  return isChromeExtension() ? <ChromeImportDialog /> : <RegularImportDialog />;
}
