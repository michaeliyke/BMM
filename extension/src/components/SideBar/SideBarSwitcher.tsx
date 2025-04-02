import { useEffect } from "react";
import { useAppState } from "../../hooks/globalstate";
import ByCategories from "./filter/ByCategories";
import { ByCategoryTags } from "./filter/ByCategoryTags";
import { ByTags } from "./filter/ByTags";

/**
 * A component that renders different sidebar variations based on the filter type provided in the props.
 */
export default function SideBarSwitcher() {
  const { headerForm, setHeaderForm, filterBy } = useAppState();

  useEffect(() => {
    // The following views need the header form, so we unhide it.
    const viewsNeedForm = ["filter:categories"];
    if (filterBy && viewsNeedForm.includes(filterBy)) {
      if (headerForm === false) setHeaderForm(true);

    } else
      if (headerForm === true) setHeaderForm(false);

  }, [headerForm, setHeaderForm, filterBy]);

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
