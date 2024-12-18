import React, { useState, createContext, useEffect } from 'react';
import { IDataContext, ICategory } from './types/schemas';
import adapters from '../data/adapters';

type DataProviderProps = {
    children: React.ReactNode;
};

const fallbackData = {
    defaultCategory: {
        id: 'dummy-id',
        name: 'No Category Selected',
        is_default: 0,
        created_at: (new Date()).toUTCString(),
        updated_at: (new Date()).toUTCString(),
        tags: [],
        bookmarks: []
    },
    setDefaultCategory() { },
    data: [],
    setData() { },
}

const DataContext = createContext<IDataContext>(fallbackData);
// Doing useContext(DataContext) will produce fallbackData outside of the
// <DataProvider></DataProvider> component tree.



function DataProvider({ children }: DataProviderProps) {
    const [data, setData] = useState<ICategory[]>([]);
    const [defaultCategory, setDefaultCategory] = useState<ICategory>(fallbackData.defaultCategory);

    useEffect(() => {
        async function fetchData() {
            const _data = await adapters.getAll();
            setData(_data);
            // await adapters.loadInitialData(data);
            for (const category of _data) {
                console.log(category.name);
                if (category.is_default === 1) {
                    setDefaultCategory(category);
                }
            }
        }
        fetchData();
    }, []);

    // The context data to be made available to children components
    const contextData: IDataContext = {
        defaultCategory,
        setDefaultCategory,
        data,
        setData,
    };

    return (
        <DataContext.Provider value={contextData}>
            {children}
        </DataContext.Provider>
    );
}

// Context Data.
// Expected to add other contexts such as UserContext, etc.
export { DataContext, DataProvider };
