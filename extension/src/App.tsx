import categories from './data/data';
import Home from "./pages/Home";
import { DataProvider } from './utils/contexts';
import { useState, useEffect } from 'react';
import { ICategory } from './utils/types/schemas';
import adapters from './data/adapters';

export default function App() {
    const [data, setData] = useState<ICategory[]>(categories);

    useEffect(() => {
        adapters.getAll();
        adapters.loadInitialData(data);
    }, [data]);

    return (
        <DataProvider defaultCategory={data[0]} >
            <Home data={data} setData={setData} />
        </DataProvider>
    );
}
