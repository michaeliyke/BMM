import { useEffect } from "react";
import adapters from "./data/adapters";
import originalData from "./data/data";
import { useAppState } from "./hooks/globalstate";
import Home from "./pages/Home";



/**
 * The main application component that initializes and manages the state of the application.
 *
 * This component uses the `useState` hook to manage an array of `ICategory` objects as its state.
 * It also uses the `useEffect` hook to load initial data and fetch all categories from the adapters.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Usage example
 * <App />
 */
export default function App() {
  const { setData, setDefaultCategory } = useAppState();

  useEffect(() => {
    adapters.loadBulkData(originalData).then(() => {
      adapters.getAll()
        .then((data) => {
          for (const category of data) {
            if (category.is_default === 1) {
              setDefaultCategory(category);
            }
          }
          setData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, [setData, setDefaultCategory]);

  return (
    <Home />
  );
}
