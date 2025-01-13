import { SideBarProps } from "../../utils/types/props";
import SideBarVariator from "./SideBarVariator";
import SideBarFooter from "./SideBarFooter";
import SideBarHeader from "./SideBarHeader";


export default function SideBar({ props }: SideBarProps) {
    const {
        setData,
        selectedCategory,
    } = props;

    // return <SideBarVariator props={props} />;
    return (
        <article className="sidebar bg-gray-50">
            <SideBarHeader props={props} />

            <SideBarVariator props={props} />

            <SideBarFooter
                setData={setData}
                selectedCategory={selectedCategory}
            />
        </article>
    );
}
