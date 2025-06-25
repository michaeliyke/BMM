import Footer from "./Footer";
import Header from "./Header";
import Switcher from "./Switcher";

/**
 * SideBar component that renders a sidebar with a header, variator, and footer.
 */
export default function SideBar() {

  // return <SideBarVariator props={props} />;
  return (
    <article className="sidebar border border-gray-200 shaddow-sm">
      <Header />

      <Switcher />

      <Footer />
    </article>
  );
}
