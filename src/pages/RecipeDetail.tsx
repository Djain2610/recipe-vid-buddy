
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipeInformation, searchYouTubeVideos } from "@/lib/api";
import { Recipe, VideoSearchResult } from "@/lib/types";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Users 
} from "lucide-react";
import { isRecipeSaved, saveRecipe, removeRecipe } from "@/lib/recipeStore";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [video, setVideo] = useState<VideoSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [videoLoading, setVideoLoading] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const recipeData = await getRecipeInformation(parseInt(id));
          setRecipe(recipeData);
          setSaved(isRecipeSaved(parseInt(id)));
          
          // Fetch video once we have recipe data
          setVideoLoading(true);
          const videoData = await searchYouTubeVideos(recipeData.title);
          setVideo(videoData.items.length > 0 ? videoData.items[0] : null);
          setVideoLoading(false);
        }
      } catch (error) {
        console.error("Error fetching recipe data:", error);
        toast.error("Failed to load recipe details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeData();
  }, [id]);

  const handleSaveRecipe = () => {
    if (!recipe) return;
    
    if (saved) {
      removeRecipe(recipe.id);
      setSaved(false);
    } else {
      saveRecipe(recipe);
      setSaved(true);
    }
  };

  // Remove HTML tags from string
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="h-6 w-24 bg-muted rounded animate-pulse mb-8"></div>
        <div className="h-10 w-3/4 bg-muted rounded animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-[400px] bg-muted rounded animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded animate-pulse"></div>
              <div className="h-6 bg-muted rounded animate-pulse w-5/6"></div>
              <div className="h-6 bg-muted rounded animate-pulse w-4/6"></div>
            </div>
          </div>
          <div className="lg:col-span-1 h-[360px] bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Recipe not found</h2>
        <p className="mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass py-6 sticky top-0 z-10 border-b">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-semibold">
              CHEFBOT
            </Link>
            <Link to="/saved">
              <Button variant="outline" className="flex items-center gap-2">
                <Bookmark size={16} />
                Saved Recipes
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        <div className="fade-in">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to recipes
          </Link>
          
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">{recipe.title}</h1>
            <Button
              variant={saved ? "default" : "outline"}
              onClick={handleSaveRecipe}
              className="flex items-center gap-2"
            >
              {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              {saved ? "Saved" : "Save Recipe"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {recipe.vegetarian && <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Vegetarian</Badge>}
            {recipe.vegan && <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Vegan</Badge>}
            {recipe.glutenFree && <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Gluten Free</Badge>}
            {recipe.dairyFree && <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Dairy Free</Badge>}
            {recipe.dishTypes && recipe.dishTypes.slice(0, 3).map((type) => (
              <Badge key={type} variant="outline">{type}</Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="flex flex-wrap gap-6 py-4">
                {recipe.readyInMinutes && (
                  <div className="flex items-center gap-2">
                    <Clock className="text-primary" size={20} />
                    <div>
                      <div className="text-sm text-muted-foreground">Time</div>
                      <div className="font-medium">{recipe.readyInMinutes} minutes</div>
                    </div>
                  </div>
                )}
                
                {recipe.servings && (
                  <div className="flex items-center gap-2">
                    <Users className="text-primary" size={20} />
                    <div>
                      <div className="text-sm text-muted-foreground">Servings</div>
                      <div className="font-medium">{recipe.servings}</div>
                    </div>
                  </div>
                )}
              </div>

              {recipe.summary && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">About</h2>
                  <p className="text-muted-foreground">{stripHtml(recipe.summary)}</p>
                </div>
              )}

              <Separator />

              <div>
                <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {recipe.extendedIngredients?.map((ingredient) => (
                    <li key={ingredient.id} className="flex items-start gap-2 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                      <span>
                        {ingredient.measures.us.amount} {ingredient.measures.us.unitShort} {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
                  <ol className="space-y-6">
                    {recipe.analyzedInstructions[0].steps.map((step) => (
                      <li key={step.number} className="ml-8 list-decimal">
                        <p className="font-medium mb-1">Step {step.number}</p>
                        <p className="text-muted-foreground">{step.step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <VideoPlayer video={video} isLoading={videoLoading} />
              
              {recipe.sourceUrl && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Original Source</h3>
                  <a 
                    href={recipe.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-words"
                  >
                    {recipe.sourceUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-muted py-8 mt-8">
        <div className="container max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p>CHEFBOT © {new Date().getFullYear()} • Find recipes with video tutorials</p>
        </div>
      </footer>
    </div>
  );
};

export default RecipeDetail;
