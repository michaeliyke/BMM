import { useState, useEffect } from "react";
import adapters from "./data/adapters";
import Home from "./pages/Home";
import { ICategory } from "./utils/types/schemas";
import originalData from "./data/data";



export default function App() {
    const [data, setData] = useState<ICategory[]>([]);

    useEffect(() => {
        adapters.loadInitialData(originalData).then(() => {
            adapters.getAll()
                .then((res) => {
                    const bbb = res.flatMap((category) => category.bookmarks);
                    console.log(bbb);
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
