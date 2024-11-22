import categories from './data/data';
import Home from "./pages/Home";
import { DataProvider } from './utils/contexts';
import { useState } from 'react';
import { TCategory } from './utils/types.payload';

export default function App() {
    const [data, setData] = useState<TCategory[]>(categories);

    return (
        <DataProvider defaultCategory={data[0]} >
            <Home data={data} setData={setData} />
        </DataProvider>
    );
}
