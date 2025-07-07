import { isChromeExtension } from "../../../utils/common";
import ButtonExtension from "./ButtonExtension";
import ButtonRegular from "./ButtonRegular";

/**
 * Returns the right import button widget for the UI (Extension vs Browser envs)
 */
export default function Import() {
  return isChromeExtension() ? <ButtonExtension /> : <ButtonRegular />;
}
