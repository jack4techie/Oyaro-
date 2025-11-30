import React, { useState } from 'react';
import { ChefHat, Loader2, Sparkles, Book, Clock } from 'lucide-react';
import { generateRecipe, hasApiKey } from '../services/geminiService';
import { Recipe } from '../types';
import { useAppContext } from '../context/AppContext';

const RecipeBook: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { recipes, addRecipe } = useAppContext();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!hasApiKey()) {
      setError("Please set REACT_APP_GEMINI_API_KEY in your environment to use AI features.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateRecipe(prompt);
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        author: "AI Chef Assistant",
        ...result
      };
      addRecipe(newRecipe);
      setPrompt('');
    } catch (e) {
      setError("Failed to cook up a recipe. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-8 rounded-2xl border border-orange-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-500 rounded-lg text-white">
            <ChefHat className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-800">Family Kitchen AI</h2>
        </div>
        <p className="text-slate-600 mb-6">
          Describe a dish you remember, or list some ingredients, and our AI chef will recreate a family-style recipe card for you.
        </p>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g., 'A spicy chicken casserole using leftovers' or 'Great Grandpa's lost chili recipe'"
            className="flex-1 p-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Generate
          </button>
        </div>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map(recipe => (
          <div key={recipe.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-serif font-bold text-slate-800">{recipe.title}</h3>
                <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  {recipe.author}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                <Clock className="w-4 h-4" />
                {recipe.prepTime}
              </div>
              {recipe.story && (
                <div className="bg-white p-3 rounded-lg border border-slate-100 text-sm text-slate-600 italic">
                  "{recipe.story}"
                </div>
              )}
            </div>
            
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Book className="w-4 h-4" /> Ingredients
                </h4>
                <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-700 mb-3">Instructions</h4>
                <ol className="text-sm text-slate-600 space-y-2 list-decimal pl-4">
                  {recipe.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeBook;
