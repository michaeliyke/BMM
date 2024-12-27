import { useState } from "react";
import { SideBarProps } from "../../utils/types/props";
import ByCategories from "./filter/ByCategories";


export default function SideBarVariator(_props: SideBarProps) {
    const [filterBy, setFilterBy] = useState('categories');

    const props = {
        ..._props,
        filterBy,
        setFilterBy
    };

    switch (filterBy) {
        case 'categories':
            return <ByCategories props={props} />;
        case 'filter:tags':
            return <div>Filter:Tags</div>;
        case 'filter:category/tags':
            return <div>Filters:Category/Tags</div>;
        default:
            return <ByCategories props={props} />;
    }
}
