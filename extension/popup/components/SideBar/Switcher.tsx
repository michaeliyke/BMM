import { useAppState } from "../../hooks/globalstate";
import ByCategories from "./filter/ByCategories";
import { ByCategoryTags } from "./filter/ByCategoryTags";
import { ByTags } from "./filter/ByTags";

/**
 * A component that renders different sidebar variations based on the filter type provided in the props.
 */
export default function Switcher() {
  const { filterBy } = useAppState();

  switch (filterBy) {
    case 'filter:categories':
      return <ByCategories />;
    case 'filter:tags':
      return <ByTags />
    case 'filter:category/tags':
      return <ByCategoryTags />
    default:
      return <ByCategories />;
  }
}
