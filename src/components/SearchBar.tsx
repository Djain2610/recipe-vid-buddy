import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DietaryFilter, SearchParams } from "@/lib/types";
import DietaryFilters from "./DietaryFilters";
import { toast } from "sonner";

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState<string>("");
  const [searchType, setSearchType] = useState<"recipe" | "ingredients">("recipe");
  const [filters, setFilters] = useState<DietaryFilter>({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch({ query, searchType, filters });
    } else {
      toast.warning("Please enter a search term");
    }
  };

  const handleFilterChange = (updatedFilters: DietaryFilter) => {
    setFilters(updatedFilters);
  };

  const placeholderText = searchType === "recipe" 
    ? "Search for recipes (e.g., 'chicken curry', 'pasta carbonara')..." 
    : "Enter ingredients separated by commas (e.g., 'chicken, onion, garlic')...";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 px-4">
      <Tabs 
        defaultValue="recipe" 
        className="w-full"
        onValueChange={(value) => setSearchType(value as "recipe" | "ingredients")}
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="recipe" className="text-base">Search by Recipe</TabsTrigger>
          <TabsTrigger value="ingredients" className="text-base">Search by Ingredients</TabsTrigger>
        </TabsList>

        <TabsContent value="recipe" className="mt-0">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder={placeholderText}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                  data-cy="recipe-search-input"
                />
              </div>
              <Button type="submit" className="h-12 px-6" disabled={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
            <DietaryFilters filters={filters} onFilterChange={handleFilterChange} />
          </form>
        </TabsContent>

        <TabsContent value="ingredients" className="mt-0">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder={placeholderText}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                  data-cy="ingredient-search-input"
                />
              </div>
              <Button type="submit" className="h-12 px-6" disabled={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
            <DietaryFilters filters={filters} onFilterChange={handleFilterChange} />
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchBar;
