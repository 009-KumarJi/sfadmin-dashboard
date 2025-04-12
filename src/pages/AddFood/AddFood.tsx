import { useState, useRef, useEffect } from 'react';
import PageHeading from '../../components/ui/PageHeading';
import { foodCategories } from '../../assets/foodCategories';
import { foodService } from '../../api/services';
import type { FoodRequest } from '../../api/services/foodService';
import { FoodType, foodTypeDisplayNames } from '../../assets/FoodType';
import { FiUpload, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

// Map display names to enum values for the API
const categoryMap: Record<string, string> = {
  "North Indian": "NORTH_INDIAN",
  "South Indian": "SOUTH_INDIAN",
  "Chinese": "CHINESE",
  "Italian": "ITALIAN",
  "Mexican": "MEXICAN",
  "Thai": "THAI",
  "Continental/European": "CONTINENTAL",
  "Middle Eastern": "MIDDLE_EASTERN",
  "Breakfast": "BREAKFAST",
  "Lunch": "LUNCH",
  "Dinner": "DINNER",
  "Snacks": "SNACKS",
  "Desserts/Sweets": "DESSERTS",
  "Brunch/All-Day Breakfast": "BRUNCH",
  "Biryani/Rice Bowls": "BIRYANI",
  "Fast Food": "FAST_FOOD",
  "Healthy/Diet Options": "HEALTHY",
  "Vegan": "VEGAN",
  "Fusion/Contemporary": "FUSION",
  "Local Favorites": "LOCAL_FAVORITES",
  "Trending/Popular": "TRENDING",
  "Other": "OTHER" // Added "Other" category
};

// Add "Other" to food categories
const allCategories = [...foodCategories, "Other"];

interface FormState {
  name: string;
  description: string;
  price: string;
  category: string;
  customCategory: string;
  foodType: FoodType;
}

const AddFood = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    description: '',
    price: '',
    category: '',
    customCategory: '',
    foodType: FoodType.VEG
  });
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch custom categories when component mounts
  useEffect(() => {
    const fetchCustomCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const categories = await foodService.getCustomCategories();
        setCustomCategories(categories);
      } catch (error) {
        console.error('Failed to fetch custom categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCustomCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const clearFileInput = () => {
    setFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        toast.error('All fields are required');
        return;
      }

      // Validate customCategory when "Other" is selected
      if (formData.category === 'Other' && !formData.customCategory) {
        toast.error('Please enter a custom category');
        return;
      }

      // If "__new__" is selected but no new value is entered
      if (formData.customCategory === '__new__') {
        toast.error('Please enter a new custom category name');
        return;
      }

      if (!file) {
        toast.error('Please upload an image for the food item');
        return;
      }

      // Create the request payload
      const foodData: FoodRequest = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: categoryMap[formData.category] || '',
        foodType: formData.foodType
      };
      
      // Add customCategory if "Other" is selected
      if (formData.category === 'Other') {
        foodData.customCategory = formData.customCategory;
      }
      
      // Use the API service to add the food
      await foodService.addFood(foodData, file);
      toast.success('Food item added successfully!');

      // Reset form on success
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        customCategory: '',
        foodType: FoodType.VEG
      });
      clearFileInput();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Action buttons
  const actionButtons = (
    <>
      <button 
        type="button"
        className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        onClick={() => {
          setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            customCategory: '',
            foodType: FoodType.VEG
          });
          clearFileInput();
          toast.info('Form reset');
        }}
      >
        Cancel
      </button>
      <button 
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Item'}
      </button>
    </>
  );

  return (
    <div>
      <PageHeading 
        title="Add New Food Item" 
        subtitle="Create a new food item for your inventory"
        actions={actionButtons}
      />
      
      {/* Food item form */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Food Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter food name"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>
            
            <div className="mb-4 md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter food description"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
              >
                <option value="">Select a category</option>
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Custom Category field - only shown when 'Other' is selected */}
            {formData.category === 'Other' && (
              <div className="mb-4">
                <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Custom Category
                </label>
                <div className="relative">
                  {customCategories.length > 0 ? (
                    <select
                      id="customCategory"
                      name="customCategory"
                      value={formData.customCategory}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
                    >
                      <option value="">Select or enter a custom category</option>
                      {customCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                      <option value="__new__">+ Add new category</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      id="customCategory"
                      name="customCategory"
                      value={formData.customCategory}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter a custom category"
                    />
                  )}
                  
                  {/* Show input field when "__new__" is selected from dropdown */}
                  {customCategories.length > 0 && formData.customCategory === '__new__' && (
                    <input
                      type="text"
                      id="newCustomCategory"
                      name="customCategory"
                      value=""
                      onChange={handleChange}
                      className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter a new custom category"
                    />
                  )}
                  
                  {isLoadingCategories && (
                    <div className="absolute right-3 top-3">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {customCategories.length > 0 
                    ? "Select from existing custom categories or create a new one"
                    : "Create a new custom category"}
                </p>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="foodType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Food Type
              </label>
              <select
                id="foodType"
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
              >
                {Object.entries(foodTypeDisplayNames).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Food Image
              </label>
              <div className="flex items-center flex-wrap">
                <input
                  type="file"
                  id="image"
                  name="image"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="flex items-center cursor-pointer px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  <FiUpload className="mr-2" />
                  Upload Image
                </label>
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-md">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={clearFileInput}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button 
              type="button"
              className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
              onClick={() => {
                setFormData({
                  name: '',
                  description: '',
                  price: '',
                  category: '',
                  customCategory: '',
                  foodType: FoodType.VEG
                });
                clearFileInput();
                toast.info('Form reset');
              }}
            >
              Reset
            </button>
            <button 
              type="submit"
              className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Add Food Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFood;