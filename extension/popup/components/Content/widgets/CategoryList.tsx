import { useState } from "react";

export default function CategoryList({ categories }: { categories: string[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    return (
        <section aria-labelledby="categories-heading">
            <ul className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                    <li
                        key={index}
                        className="relative group px-3 py-1 bg-gray-100 rounded-md text-xs text-gray-700 hover:bg-gray-200 transition"
                    >
                        {category}
                        <button
                            type="button"
                            className="absolute -top-2 -right-2 hidden group-hover:flex items-center justify-center w-4 h-4 bg-red-500 text-white rounded-full transition hover:bg-red-600"
                            onClick={() => setSelectedCategory(category)}
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>

            {/* Custom Modal */}
            {selectedCategory && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-4 shadow-lg w-80">
                        <h2 className="text-sm font-semibold">Remove Category</h2>
                        <p className="text-sm text-gray-600 mt-2">
                            Are you sure you want to remove <strong>{selectedCategory}</strong>?
                        </p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
                                onClick={() => setSelectedCategory(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                                onClick={() => {
                                    console.log(`Removed category: ${selectedCategory}`);
                                    setSelectedCategory(null);
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
