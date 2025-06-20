import { useEffect } from "react";
import adapters from "./data/adapters";
import { useAppState } from "./hooks/globalstate";
import Home from "./pages/Home";
import { error } from "./utils/functional.lib.dev";



/**
 * The main application component that initializes and manages the state of the application.
 */
export default function App() {
  const { setBmm } = useAppState();

  useEffect(function () {
    async function init() {
      const bmm = await adapters.fetchAllProperties();
      setBmm(bmm);
    }
    init().catch(error);
  }, [setBmm]);

  return <Home />;
}
