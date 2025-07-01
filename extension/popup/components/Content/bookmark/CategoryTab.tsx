import CategoryList from "../widgets/CategoryList";

/**
 * The category tab of the details view of a bookmark
 */
export default function CategoryTab() {

  const categories = [
    'Category 1',
    'Category 2',
    'Category 3',
    'Category 4',
    'Category 5',
    'Category 6',
    'Category 7',
    'Category 8',
    'Category 9',
    'Category 10',

  ];

  return <>
    <section aria-labelledby="create-category-heading" className="w-60 mx-auto p-4 bg-white shadow-md rounded-md border border-gray-200">
      <h2
        id="create-category-heading"
        className="text-md font-semibold text-sm text-gray-400 mb-2 text-center"
      >
        Create a New Category
      </h2>
      <form className="flex flex-col space-y-2">
        <label htmlFor="category-name">

          <input
            type="text"
            id="category-name"
            name="category-name"
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 text-xs text-gray-500"
            placeholder="Enter category name" />

        </label>
        <button
          type="button"
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs self-center"
          onClick={() => console.log('Create category button clicked')}
        >
          Create
        </button>
      </form>
    </section>
    <hr className="my-3" />
    <CategoryList categories={categories} />
  </>;
}
