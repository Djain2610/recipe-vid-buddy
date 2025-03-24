
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Recipe } from "@/lib/types";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, className }) => {
  // Function to truncate text
  const truncate = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Link to={`/recipe/${recipe.id}`} className="h-full block">
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] h-full flex flex-col ${className}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          {recipe.readyInMinutes && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full text-xs">
              <Clock size={12} className="text-primary" />
              <span>{recipe.readyInMinutes} min</span>
            </div>
          )}
          {recipe.servings && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full text-xs">
              <Users size={12} className="text-primary" />
              <span>{recipe.servings} servings</span>
            </div>
          )}
        </div>
        <CardContent className="flex-grow pt-4">
          <h3 className="font-medium text-lg mb-2 line-clamp-2">{recipe.title}</h3>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {recipe.vegetarian && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Vegetarian</Badge>}
            {recipe.vegan && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Vegan</Badge>}
            {recipe.glutenFree && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Gluten Free</Badge>}
            {recipe.dairyFree && <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Dairy Free</Badge>}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 pb-4">
          {recipe.usedIngredientCount !== undefined && recipe.missedIngredientCount !== undefined && (
            <div className="text-sm text-muted-foreground">
              {recipe.usedIngredientCount} ingredients matched, {recipe.missedIngredientCount} needed
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RecipeCard;
