import React from 'react';

export type FilterCategory = {
  id: string;
  name: string;
};

type CategoryFilterProps = {
  categories: FilterCategory[];
  selectedCategories: string[];
  onCategoryChange: (selectedCategories: string[]) => void;
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
}) => {
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  const clearFilters = () => {
    onCategoryChange([]);
  };

  const selectAll = () => {
    onCategoryChange(categories.map(cat => cat.id));
  };

  return (
    <div className="category-filter mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-foreground">Filter by Directory</h3>
        <div className="space-x-2">
          <button onClick={selectAll} className="text-sm px-3 py-1 rounded-md bg-primary text-background">Select All</button>
          <button onClick={clearFilters} className="text-sm px-3 py-1 rounded-md bg-accent text-background">Clear</button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategories.includes(category.id)
                ? 'bg-secondary text-background'
                : 'bg-background-light text-foreground border border-secondary'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
