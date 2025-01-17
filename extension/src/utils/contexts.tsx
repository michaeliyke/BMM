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



/**
 * DataProvider component that fetches and provides data context to its children components.
 *
 * @param {DataProviderProps} props - The properties for the DataProvider component.
 * @param {React.ReactNode} props.children - The child components that will have access to the data context.
 *
 * @returns {JSX.Element} The DataContext.Provider component with the context data.
 *
 * @remarks
 * This component uses the `useState` and `useEffect` hooks to manage and fetch data.
 * It initializes the data state with an empty array and the default category state with a fallback value.
 * The `fetchData` function is called inside a `useEffect` hook to fetch data asynchronously and update the state.
 * The context data includes the default category, a function to set the default category, the data array, and a function to set the data array.
 *
 * @example
 * ```tsx
 * <DataProvider>
 *   <YourComponent />
 * </DataProvider>
 * ```
 */
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
