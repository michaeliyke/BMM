import React, { useState, createContext } from 'react';
import { IDataContext, TCategory } from './types.payload';

type DataProviderProps = {
    children: React.ReactNode;
    defaultCategory: TCategory;
};

const fallbackData = {
    defaultCategory: {
        name: 'Dummy Category',
        bookmarks: []
    },
    setDefaultCategory() { }
}

const DataContext = createContext<IDataContext>(fallbackData);
// Doing useContext(DataContext) will produce fallbackData outside of the
// <DataProvider></DataProvider> component tree.


function DataProvider({ children, defaultCategory }: DataProviderProps) {
    const [defaultCategory_, setDefaultCategory] = useState<TCategory>(defaultCategory);

    const contextData: IDataContext = {
        defaultCategory: defaultCategory_,
        setDefaultCategory,
    };

    return (
        <DataContext.Provider value={contextData}>
            {children}
        </DataContext.Provider>
    );
}

export { DataContext, DataProvider };
