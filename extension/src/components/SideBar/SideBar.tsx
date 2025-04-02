import SideBarFooter from "./SideBarFooter";
import SideBarHeader from "./SideBarHeader";
import SideBarSwitcher from "./SideBarSwitcher";

/**
 * SideBar component that renders a sidebar with a header, variator, and footer.
 */
export default function SideBar() {

  // return <SideBarVariator props={props} />;
  return (
    <article className="sidebar bg-white border-t border-t-gray-200">
      <SideBarHeader />

      <SideBarSwitcher />

      <SideBarFooter />
    </article>
  );
}
