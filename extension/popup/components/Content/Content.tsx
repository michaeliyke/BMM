
import Body from "./Body";
import Header from "./Header";

/**
 * ContentBar component is responsible for rendering the content section of the application.
 * It includes a header, body, and footer, and manages the state of bookmarks and filtered categories.
 */
export default function Content() {
  return (
    <article className="content mt-0 border-l border-r border-gray-200 shadow-sm">
      <Header />

      <Body />
      <footer className="p-4 bg-gray-100 border-t border-gray-200">Content Footer</footer>
    </article>
  );
}
