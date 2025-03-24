
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DietaryFilter } from "@/lib/types";

interface DietaryFiltersProps {
  filters: DietaryFilter;
  onFilterChange: (filters: DietaryFilter) => void;
}

const DietaryFilters: React.FC<DietaryFiltersProps> = ({ filters, onFilterChange }) => {
  const handleFilterChange = (filterName: keyof DietaryFilter) => {
    onFilterChange({
      ...filters,
      [filterName]: !filters[filterName],
    });
  };

  return (
    <div className="bg-secondary p-4 rounded-lg">
      <h3 className="text-sm font-medium mb-3">Dietary Preferences</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vegetarian" 
            checked={filters.vegetarian}
            onCheckedChange={() => handleFilterChange("vegetarian")}
          />
          <label htmlFor="vegetarian" className="text-sm cursor-pointer">
            Vegetarian
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vegan" 
            checked={filters.vegan}
            onCheckedChange={() => handleFilterChange("vegan")}
          />
          <label htmlFor="vegan" className="text-sm cursor-pointer">
            Vegan
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="glutenFree" 
            checked={filters.glutenFree}
            onCheckedChange={() => handleFilterChange("glutenFree")}
          />
          <label htmlFor="glutenFree" className="text-sm cursor-pointer">
            Gluten Free
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="dairyFree" 
            checked={filters.dairyFree}
            onCheckedChange={() => handleFilterChange("dairyFree")}
          />
          <label htmlFor="dairyFree" className="text-sm cursor-pointer">
            Dairy Free
          </label>
        </div>
      </div>
    </div>
  );
};

export default DietaryFilters;
