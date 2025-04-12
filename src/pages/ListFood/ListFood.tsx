import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate import
import PageHeading from '../../components/ui/PageHeading';
import { foodService } from '../../api/services';
import type { FoodResponse } from '../../api/services/foodService';
import { FoodType, foodTypeDisplayNames } from '../../assets/FoodType';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiInfo } from 'react-icons/fi'; // Added FiInfo icon

// Reverse map to convert API category values to display names
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
const getCategoryDisplay = (food: FoodResponse) => {
  if (food.category === "OTHER" && food.customCategory) {
    return food.customCategory + "*";
  }
  return categoryDisplayMap[food.category] || food.category;
};

// Function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

const ListFood = () => {
  const [foods, setFoods] = useState<FoodResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState<FoodResponse | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate(); // Add this line to import the navigate function

  // Fetch food items on component mount
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const data = await foodService.getAllFoods();
        setFoods(data);
      } catch (err) {
        console.error('Failed to fetch food items:', err);
        toast.error('Failed to load food items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Handle delete confirmation
  const handleDeleteClick = (food: FoodResponse) => {
    setSelectedFood(food);
    setShowDeleteModal(true);
  };

  // Handle delete action
  const handleDelete = async () => {
    if (!selectedFood) return;
    
    try {
      setDeleteLoading(true);
      await foodService.deleteFood(selectedFood.id);
      
      // Remove deleted item from state
      setFoods(foods.filter(food => food.id !== selectedFood.id));
      setShowDeleteModal(false);
      setSelectedFood(null);
      toast.success(`"${selectedFood.name}" has been deleted successfully`);
    } catch (err) {
      console.error('Failed to delete food item:', err);
      toast.error('Failed to delete food item. Please try again later.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Add this new handler for navigating to food details
  const handleFoodClick = (food: FoodResponse) => {
    navigate(`/food/${food.id}`);
  };

  // Action button to add new food item
  const addButton = (
    <Link 
      to="/add-food" 
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Add New Item
    </Link>
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
        title="Food Items" 
        subtitle="View and manage all food items in the inventory"
        actions={addButton}
      />
      
      {/* Food items list */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading food items...</p>
          </div>
        ) : foods.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">No food items found.</p>
            <Link 
              to="/add-food"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add Your First Food Item
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop view - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Food Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {foods.map((food) => (
                    <tr 
                      key={food.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => handleFoodClick(food)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            <img 
                              src={food.imageUrl} 
                              alt={food.name} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x40?text=Food';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {food.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xs">
                              {truncateText(food.description || '', 50)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {getCategoryDisplay(food)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          ₹{food.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <FoodTypeBadge type={food.foodType} />
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking on actions
                      >
                        <div className="flex justify-end space-x-3">
                          <button 
                            className="p-1.5 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                            onClick={() => toast.info("Edit functionality will be implemented soon!")}
                            title="Edit"
                            aria-label="Edit food item"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button 
                            className="p-1.5 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors"
                            onClick={() => handleDeleteClick(food)}
                            title="Delete"
                            aria-label="Delete food item"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view - Cards */}
            <div className="md:hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {foods.map((food) => (
                  <div 
                    key={food.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    onClick={() => handleFoodClick(food)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src={food.imageUrl} 
                            alt={food.name} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x40?text=Food';
                            }}
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {food.name}
                          </div>
                          <div className="flex items-center mt-1">
                            <FoodTypeBadge type={food.foodType} />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                              ₹{food.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div 
                        className="flex space-x-1"
                        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking on actions
                      >
                        <button 
                          className="p-1.5 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 rounded-full transition-colors"
                          onClick={() => toast.info("Edit functionality will be implemented soon!")}
                          aria-label="Edit food item"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          className="p-1.5 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 rounded-full transition-colors"
                          onClick={() => handleDeleteClick(food)}
                          aria-label="Delete food item"
                        >
                          <FiTrash2 size={16} />
                        </button>
                        <button 
                          className="p-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 rounded-full transition-colors"
                          onClick={() => handleFoodClick(food)}
                          aria-label="View food details"
                        >
                          <FiInfo size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Category:</span> {getCategoryDisplay(food)}
                      </div>
                      {food.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {truncateText(food.description, 80)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && selectedFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Are you sure you want to delete "{selectedFood.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedFood(null);
                  }}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListFood;