import { useState, useEffect } from "react";
import adapters from "./data/adapters";
import Home from "./pages/Home";
import { ICategory } from "./utils/types/schemas";

function sortedCategories(data: ICategory[]): ICategory[] {
    // Deep copy the original data to avoid mutation
    const copy: ICategory[] = JSON.parse(JSON.stringify(data));
    // Sort the categories alphabetically by name
    copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
}

export default function App() {
    const [data, setData] = useState<ICategory[]>([]);

    useEffect(() => {
        adapters.getAll()
            .then((res) => {
                setData(res);
            })
            .catch((err) => {
                console.log(err);
            });
        // await adapters.loadInitialData(data);
    }, []);

    return (
        <Home data={sortedCategories(data)} setData={setData} />
    );
}
