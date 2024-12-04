import categories from './data/data';
import Home from "./pages/Home";
import { DataProvider } from './utils/contexts';
import { useState, useEffect } from 'react';
import { TCategory } from './utils/types/payload';
import { Operator } from './data/operator';
import adapters from './data/adapters';

export default function App() {
    const [data, setData] = useState<TCategory[]>(categories);

    useEffect(() => {
        Operator.getRecords<TCategory>('categories').then((categories) => {
            setData(categories);
        });

        adapters.getAll();
    }, []);

    return (
        <DataProvider defaultCategory={data[0]} >
            <Home data={data} setData={setData} />
        </DataProvider>
    );
}
