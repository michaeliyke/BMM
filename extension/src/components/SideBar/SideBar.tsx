import { useState } from "react";
import { SideBarProps } from "../../utils/types/props";
import SideBarVariator from "./SideBarVariator";
import SideBarFooter from "./SideBarFooter";
import SideBarHeader from "./SideBarHeader";


export default function SideBar({ props: _props }: SideBarProps) {
    const [filterBy, setFilterBy] = useState('categories');

    const props = {
        ..._props,
        filterBy,
        setFilterBy
    };

    const {
        setData,
        selectedCategory,
    } = props;

    // return <SideBarVariator props={props} />;
    return (
        <article className="sidebar">
            <SideBarHeader props={props}></SideBarHeader>
            <SideBarVariator props={props}></SideBarVariator>
            <SideBarFooter
                setData={setData}
                selectedCategory={selectedCategory}
            ></SideBarFooter>
        </article>
    );
}
