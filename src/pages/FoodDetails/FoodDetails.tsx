import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foodService } from '../../api/services';
import type { FoodResponse } from '../../api/services/foodService';
import { FoodType, foodTypeDisplayNames } from '../../assets/FoodType';
import PageHeading from '../../components/ui/PageHeading';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi';

// Use the same mapping from ListFood component
const categoryDisplayMap: Record<string, string> = {
  "NORTH_INDIAN": "North Indian",
  "SOUTH_INDIAN": "South Indian",
  "CHINESE": "Chinese",
  "ITALIAN": "Italian",
  "MEXICAN": "Mexican",
  "THAI": "Thai",
  "CONTINENTAL": "Continental/European",
  "MIDDLE_EASTERN": "Middle Eastern",
  "BREAKFAST": "Breakfast",
  "LUNCH": "Lunch",
  "DINNER": "Dinner",
  "SNACKS": "Snacks",
  "DESSERTS": "Desserts/Sweets",
  "BRUNCH": "Brunch/All-Day Breakfast",
  "BIRYANI": "Biryani/Rice Bowls",
  "FAST_FOOD": "Fast Food",
  "HEALTHY": "Healthy/Diet Options",
  "VEGAN": "Vegan",
  "FUSION": "Fusion/Contemporary",
  "LOCAL_FAVORITES": "Local Favorites",
  "TRENDING": "Trending/Popular"
};

// Function to get the display category
const getCategoryDisplay = (category: string, customCategory?: string) => {
  if (category === "OTHER" && customCategory) {
    return customCategory + "*";
  }
  return categoryDisplayMap[category] || category;
};

const FoodDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [food, setFood] = useState<FoodResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      if (!id) {
        setError('No food ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching food with ID:", id);
        const foodData = await foodService.getFoodById(id);
        console.log("Food data received:", foodData);
        setFood(foodData);
      } catch (err) {
        console.error('Failed to fetch food details:', err);
        setError('Failed to load food details. Please try again later.');
        toast.error('Failed to load food details');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  // Action buttons for the page header
  const actionButtons = (
    <>
      <button
        className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft className="mr-2" />
        Back
      </button>
      <button 
        onClick={() => toast.info("Edit functionality will be implemented soon!")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
      >
        <FiEdit2 className="mr-2" />
        Edit
      </button>
    </>
  );

  // Food type badge component
  const FoodTypeBadge = ({ type }: { type: FoodType }) => {
    const badgeColor = type === FoodType.VEG 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : type === FoodType.NON_VEG
        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
        {foodTypeDisplayNames[type]}
      </span>
    );
  };

  return (
    <div>
      <PageHeading 
        title={food ? food.name : 'Food Details'} 
        subtitle={food ? `View detailed information about ${food.name}` : 'Loading food details...'}
        actions={actionButtons}
      />
      
      {loading ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading food details...</p>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <p className="text-red-500">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      ) : food ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* Food Image */}
            <div className="md:w-1/3 p-6">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                <img 
                  src={food.imageUrl} 
                  alt={food.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Food';
                  }}
                />
              </div>
            </div>
            
            {/* Food Details */}
            <div className="md:w-2/3 p-6">
              <div className="flex flex-wrap gap-2 mb-4 items-center">
                <FoodTypeBadge type={food.foodType} />
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs font-medium">
                  {getCategoryDisplay(food.category, food.customCategory)}
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {food.name}
              </h1>
              
              <div className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
                ₹{food.price.toFixed(2)}
              </div>
              
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h2>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {food.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h2 className="font-medium text-gray-500 dark:text-gray-400 mb-1">Created</h2>
                  <p className="text-gray-800 dark:text-gray-200">
                    {new Date(food.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h2 className="font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</h2>
                  <p className="text-gray-800 dark:text-gray-200">
                    {new Date(food.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">No food data found.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodDetails;
