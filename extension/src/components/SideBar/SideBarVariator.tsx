import { SideBarProps } from "../../utils/types/props";
import ByCategories from "./filter/ByCategories";
import ByCategoryTags from "./filter/ByCategoryTags";
import ByTags from "./filter/ByTags";


export default function SideBarVariator({ props }: SideBarProps) {
    switch (props.filterBy) {
        case 'categories':
            return <ByCategories props={props} />;
        case 'filter:tags':
            return <ByTags props={props} />
        case 'filter:category/tags':
            return <ByCategoryTags props={props} />
        default:
            return <ByCategories props={props} />;
    }
}
