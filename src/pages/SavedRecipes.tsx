
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, Filter, Trash2 } from "lucide-react";
import { Recipe } from "@/lib/types";
import { getSavedRecipes, removeRecipe } from "@/lib/recipeStore";
import RecipeCard from "@/components/RecipeCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const SavedRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [recipeToDelete, setRecipeToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [recipes, searchTerm, filters]);

  const loadSavedRecipes = () => {
    const savedRecipes = getSavedRecipes();
    setRecipes(savedRecipes);
    setFilteredRecipes(savedRecipes);
  };

  const applyFilters = () => {
    let filtered = [...recipes];

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply dietary filters
    const activeFilters = Object.entries(filters).filter(([_, value]) => value);
    if (activeFilters.length > 0) {
      filtered = filtered.filter((recipe) =>
        activeFilters.every(
          ([key, _]) => recipe[key as keyof Recipe] === true
        )
      );
    }

    setFilteredRecipes(filtered);
  };

  const handleRemoveRecipe = (id: number) => {
    setRecipeToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmRemoveRecipe = () => {
    if (recipeToDelete !== null) {
      removeRecipe(recipeToDelete);
      loadSavedRecipes();
      toast.success("Recipe removed from saved recipes");
      setShowDeleteConfirm(false);
      setRecipeToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass py-6 sticky top-0 z-10 border-b">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-semibold">
              CHEFBOT
            </Link>
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Search
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        <div className="fade-in">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <Bookmark className="text-primary" />
              Saved Recipes
            </h1>
          </div>

          {recipes.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-grow relative">
                  <Input
                    type="text"
                    placeholder="Search saved recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter size={16} />
                      Filters
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Dietary Filters</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={filters.vegetarian}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, vegetarian: checked })
                      }
                    >
                      Vegetarian
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.vegan}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, vegan: checked })
                      }
                    >
                      Vegan
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.glutenFree}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, glutenFree: checked })
                      }
                    >
                      Gluten Free
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.dairyFree}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, dairyFree: checked })
                      }
                    >
                      Dairy Free
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <div key={recipe.id} className="relative group">
                      <RecipeCard recipe={recipe} />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveRecipe(recipe.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-xl font-medium mb-2">No matching recipes</h2>
                  <p className="text-muted-foreground">
                    Try different search terms or filters.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">No saved recipes yet</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring recipes and save them for later.
              </p>
              <Link to="/">
                <Button>Find Recipes</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-muted py-8 mt-8">
        <div className="container max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p>CHEFBOT © {new Date().getFullYear()} • Find recipes with video tutorials</p>
        </div>
      </footer>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this recipe from your saved recipes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveRecipe}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SavedRecipes;
