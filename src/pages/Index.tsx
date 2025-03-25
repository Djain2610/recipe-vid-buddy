import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import RecipeCard from "@/components/RecipeCard";
import { Recipe, SearchParams } from "@/lib/types";
import { searchRecipesByIngredients, searchRecipesByQuery } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const Index: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleSearch = async (params: SearchParams) => {
    try {
      setIsLoading(true);
      setHasSearched(true);
      
      let searchResults: Recipe[];
      
      if (params.searchType === "ingredients") {
        searchResults = await searchRecipesByIngredients(params.query, params.filters);
      } else {
        searchResults = await searchRecipesByQuery(params.query, params.filters);
      }
      
      setRecipes(searchResults);
      
      if (searchResults.length === 0) {
        toast.info("No recipes found. Try different search terms or filters.");
      } else if (searchResults.some(recipe => recipe.title.includes("Unavailable"))) {
        toast.warning("We're currently experiencing API limits. Some recipes might show limited information.");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search recipes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass py-8 border-b">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="text-2xl font-semibold">
              CHEFBOT
            </Link>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/saved">
                    <Button variant="outline" className="flex items-center gap-2">
                      <BookmarkIcon size={16} />
                      Saved Recipes
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout} 
                    className="flex items-center gap-2"
                  >
                    <LogOutIcon size={16} />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="outline" className="flex items-center gap-2">
                    <LogInIcon size={16} />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="slide-up" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Find Perfect Recipes
            </h1>
            <p className="text-center text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Search by recipe name or ingredients you have on hand, and discover cooking videos to help you prepare your next delicious meal.
            </p>
          </div>
          <div className="slide-up" style={{ animationDelay: "0.4s" }}>
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </header>

      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-[320px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            {hasSearched && recipes.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-medium mb-2">No recipes found</h2>
                <p className="text-muted-foreground mb-6">Try different search terms or ingredients.</p>
              </div>
            ) : (
              <>
                {recipes.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-medium mb-6">
                      Found {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {!hasSearched && (
          <div className="text-center py-12 slide-up" style={{ animationDelay: "0.6s" }}>
            <h2 className="text-2xl font-medium mb-2">Start your culinary journey</h2>
            <p className="text-muted-foreground mb-6">
              Search for recipes by name or ingredients to discover delicious meals with video tutorials.
            </p>
          </div>
        )}
      </main>

      <footer className="bg-muted py-8">
        <div className="container max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p>CHEFBOT © {new Date().getFullYear()} • Find recipes with video tutorials</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
