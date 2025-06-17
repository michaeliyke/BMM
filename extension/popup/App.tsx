import { useEffect } from "react";
import adapters from "./data/adapters";
import { useAppState } from "./hooks/globalstate";
import Home from "./pages/Home";
import { error } from "./utils/functional.lib.dev";



/**
 * The main application component that initializes and manages the state of the application.
 */
export default function App() {
  const { setData, setAllProperties } = useAppState();

  useEffect(function () {
    async function init() {
      const categories = await adapters.getAll();
      setData(categories);
      setAllProperties(await adapters.fetchAllProperties());
      return categories;
    }
    init().catch(error);
  }, [setData, setAllProperties]);

  return <Home />;
}
