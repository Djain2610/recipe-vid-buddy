
import { Recipe, SearchParams, VideoSearchResponse, DietaryFilter } from "./types";

const YOUTUBE_API_KEY = "AIzaSyDhMzDrv5zJk2nszdtiGyu3eva604iQMbc";
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

const SPOONACULAR_API_KEY = "73b7fcb10622451ea61923218b88252e";
const SPOONACULAR_RECIPE_INFO_URL = "https://api.spoonacular.com/recipes/{id}/information";
const SPOONACULAR_API_URL = "https://api.spoonacular.com/recipes/findByIngredients";
const SPOONACULAR_COMPLEX_SEARCH_URL = "https://api.spoonacular.com/recipes/complexSearch";

// Sample data to use when the API quota is exceeded
const sampleRecipes: Recipe[] = [
  {
    id: 654959,
    title: "Pasta With Tuna",
    image: "https://spoonacular.com/recipeImages/654959-312x231.jpg",
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: true,
    readyInMinutes: 45,
    servings: 4
  },
  {
    id: 511728,
    title: "Pasta Margherita",
    image: "https://spoonacular.com/recipeImages/511728-312x231.jpg",
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    readyInMinutes: 30,
    servings: 4
  },
  {
    id: 654812,
    title: "Pasta and Seafood",
    image: "https://spoonacular.com/recipeImages/654812-312x231.jpg",
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    readyInMinutes: 45,
    servings: 2
  }
];

export const searchRecipesByIngredients = async (ingredients: string, filters: DietaryFilter) => {
  try {
    // First, get recipes by ingredients
    const ingredientsParams = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      ingredients,
      number: "12",
      ranking: "1",
      ignorePantry: "true",
    });

    const response = await fetch(`${SPOONACULAR_API_URL}?${ingredientsParams}`);
    
    if (!response.ok) {
      // Check if it's a quota exceeded error (402)
      if (response.status === 402) {
        console.warn("API quota exceeded, returning fallback data");
        
        // Apply filters to sample data if needed
        if (Object.values(filters).some(Boolean)) {
          return sampleRecipes.filter(recipe => {
            return Object.entries(filters).every(([filter, isActive]) => {
              if (!isActive) return true;
              return recipe[filter as keyof Recipe] === true;
            });
          });
        }
        
        return sampleRecipes;
      }
      
      throw new Error(`API error: ${response.status}`);
    }
    
    const recipes: Recipe[] = await response.json();
    
    // Apply filters if any are active
    if (Object.values(filters).some(Boolean)) {
      const filteredRecipes = [];
      
      for (const recipe of recipes) {
        // Fetch detailed information for each recipe to check dietary info
        const detailedRecipe = await getRecipeInformation(recipe.id);
        
        // Check if recipe meets all active filters
        const meetsFilters = Object.entries(filters).every(([filter, isActive]) => {
          if (!isActive) return true;
          return detailedRecipe[filter as keyof Recipe] === true;
        });
        
        if (meetsFilters) {
          filteredRecipes.push({...recipe, ...detailedRecipe});
        }
      }
      
      return filteredRecipes;
    }
    
    return recipes;
  } catch (error) {
    console.error("Error searching recipes by ingredients:", error);
    throw error;
  }
};

export const searchRecipesByQuery = async (query: string, filters: DietaryFilter) => {
  try {
    const dietParams = [];
    if (filters.vegetarian) dietParams.push("vegetarian");
    if (filters.vegan) dietParams.push("vegan");
    if (filters.glutenFree) dietParams.push("gluten free");
    if (filters.dairyFree) dietParams.push("dairy free");
    
    const diet = dietParams.join(",");
    
    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      query,
      number: "12",
      addRecipeInformation: "true",
      fillIngredients: "true",
      ...(diet ? { diet } : {})
    });

    const response = await fetch(`${SPOONACULAR_COMPLEX_SEARCH_URL}?${params}`);
    
    if (!response.ok) {
      // Check if it's a quota exceeded error (402)
      if (response.status === 402) {
        console.warn("API quota exceeded, returning fallback data");
        
        // Apply filters to sample data if needed
        if (Object.values(filters).some(Boolean)) {
          return sampleRecipes.filter(recipe => {
            return Object.entries(filters).every(([filter, isActive]) => {
              if (!isActive) return true;
              return recipe[filter as keyof Recipe] === true;
            });
          });
        }
        
        return sampleRecipes;
      }
      
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results as Recipe[];
  } catch (error) {
    console.error("Error searching recipes by query:", error);
    throw error;
  }
};

export const getRecipeInformation = async (id: number): Promise<Recipe> => {
  try {
    const url = SPOONACULAR_RECIPE_INFO_URL.replace("{id}", id.toString());
    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      includeNutrition: "false",
    });

    const response = await fetch(`${url}?${params}`);
    
    if (!response.ok) {
      // If quota exceeded, return a simple fallback recipe
      if (response.status === 402) {
        console.warn("API quota exceeded when fetching recipe details, returning fallback data");
        // Return the matching sample recipe if available, or a generic one
        const fallbackRecipe = sampleRecipes.find(r => r.id === id);
        if (fallbackRecipe) return fallbackRecipe;
        
        return {
          id,
          title: "Recipe Information Unavailable",
          image: "https://spoonacular.com/recipeImages/placeholder.jpg",
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          dairyFree: false,
          readyInMinutes: 30,
          servings: 4,
          summary: "Detailed recipe information is currently unavailable due to API limitations.",
          instructions: "Please try again later to view the full recipe instructions."
        };
      }
      
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching recipe information for ID ${id}:`, error);
    throw error;
  }
};

export const searchYouTubeVideos = async (query: string): Promise<VideoSearchResponse> => {
  try {
    const params = new URLSearchParams({
      key: YOUTUBE_API_KEY,
      q: `${query} recipe`,
      part: "snippet",
      type: "video",
      maxResults: "5",
    });

    const response = await fetch(`${YOUTUBE_SEARCH_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error searching YouTube videos:", error);
    throw error;
  }
};
