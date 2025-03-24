
import { Recipe } from "./types";
import { toast } from "sonner";

const SAVED_RECIPES_KEY = "savedRecipes";

export const saveRecipe = (recipe: Recipe): void => {
  try {
    const savedRecipes = getSavedRecipes();
    
    // Check if recipe is already saved
    if (savedRecipes.some(r => r.id === recipe.id)) {
      toast.info("Recipe already saved");
      return;
    }
    
    // Add recipe to saved recipes
    const updatedRecipes = [...savedRecipes, recipe];
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updatedRecipes));
    
    toast.success("Recipe saved successfully");
  } catch (error) {
    console.error("Error saving recipe:", error);
    toast.error("Failed to save recipe");
  }
};

export const getSavedRecipes = (): Recipe[] => {
  try {
    const savedRecipesJson = localStorage.getItem(SAVED_RECIPES_KEY);
    return savedRecipesJson ? JSON.parse(savedRecipesJson) : [];
  } catch (error) {
    console.error("Error getting saved recipes:", error);
    return [];
  }
};

export const removeRecipe = (recipeId: number): void => {
  try {
    const savedRecipes = getSavedRecipes();
    const updatedRecipes = savedRecipes.filter(recipe => recipe.id !== recipeId);
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updatedRecipes));
    
    toast.success("Recipe removed successfully");
  } catch (error) {
    console.error("Error removing recipe:", error);
    toast.error("Failed to remove recipe");
  }
};

export const isRecipeSaved = (recipeId: number): boolean => {
  try {
    const savedRecipes = getSavedRecipes();
    return savedRecipes.some(recipe => recipe.id === recipeId);
  } catch (error) {
    console.error("Error checking if recipe is saved:", error);
    return false;
  }
};
