import { closePopup, isChromeExtension, showChromePopup, validPopup } from "../utils/common";
import { log } from "../utils/functional.lib.dev";

let POPUPID: number = chrome.windows.WINDOW_ID_NONE; // Literal value: -1
let PREVWINID: number | undefined = undefined;

console.log("App initialized: ", POPUPID, PREVWINID);
log("Is extension? ", isChromeExtension());

// Open a new application window when the extension icon is clicked on
chrome.action.onClicked.addListener(async function launchApp() {
  if (validPopup(POPUPID)) {// First close any open window before opening another
    await closePopup(POPUPID).catch(console.error);
    POPUPID = PREVWINID = chrome.windows.WINDOW_ID_NONE;
  }

  await showChromePopup("../../../../popup/index.html")
    .then((win) => {
      if (!win.id)
        throw new Error("Invalid window: win.id is undefined!");
      POPUPID = PREVWINID = win.id;
    })
    .catch(console.error);
  console.log("Window created: ", POPUPID);
});

// chrome.windows.onFocusChanged.addListener(async function focusChange(winID) {
//   PREVWINID = winID;
//   if (
//     POPUPID === chrome.windows.WINDOW_ID_NONE /* Our application window does not exists? */
//     || POPUPID === winID /* The focused window is our application window? */
//     || winID === chrome.windows.WINDOW_ID_NONE /* Focused window is another app? */
//   ) return;

//   if (PREVWINID === chrome.windows.WINDOW_ID_NONE)
//     return; // If user moved away, don't dismiss right away.

//   await closePopup(POPUPID).catch(console.error);
//   POPUPID = PREVWINID = chrome.windows.WINDOW_ID_NONE;
//   console.log("Window closed:", POPUPID)
// });
