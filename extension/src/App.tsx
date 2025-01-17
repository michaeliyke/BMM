import { useState, useEffect } from "react";
import adapters from "./data/adapters";
import Home from "./pages/Home";
import { ICategory } from "./utils/types/schemas";
import originalData from "./data/data";



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
    const [data, setData] = useState<ICategory[]>([]);

    useEffect(() => {
        adapters.loadInitialData(originalData).then(() => {
            adapters.getAll()
                .then((res) => {
                    setData(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    }, []);

    return (
        <Home data={data} setData={setData} />
    );
}
