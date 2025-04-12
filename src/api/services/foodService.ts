import { apiClient, apiUploadClient } from '../axiosConfig';
import { FoodType } from '../../assets/FoodType';
import axios from 'axios';
import { toast } from 'react-toastify';

// Define types for the API
export interface FoodCategory {
  displayName: string;
}

export interface FoodRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  customCategory?: string;
  foodType: FoodType;
}

export interface FoodResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  customCategory?: string;
  foodType: FoodType;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Food API service functions
const foodService = {
  // Get all foods
  getAllFoods: async (): Promise<FoodResponse[]> => {
    const response = await apiClient.get('/foods');
    return response.data;
  },

  // Get a single food by ID
  getFoodById: async (id: string): Promise<FoodResponse> => {
    const response = await apiClient.get(`/foods/${id}`);
    return response.data;
  },

  // Get all custom categories
  getCustomCategories: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get('/foods/custom-categories');
      return response.data;
    } catch (error) {
      // If the endpoint returns 204 No Content, return an empty array
      if (axios.isAxiosError(error) && error.response?.status === 204) {
        return [];
      }
      throw error;
    }
  },

  // Add a new food item (with image)
  addFood: async (foodData: FoodRequest, imageFile: File): Promise<FoodResponse> => {
    const formData = new FormData();
    
    // Add the JSON as a string part
    formData.append('food', JSON.stringify(foodData));
    
    // Add the file
    formData.append('file', imageFile);

    const response = await apiUploadClient.post('/foods', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.status === 201) {
      toast.success('Food added successfully!');
      return response.data;
    } else {
      toast.error('Failed to add food');
      return Promise.reject(new Error('Failed to add food'));
    }
  },

  // Update an existing food
  updateFood: async (id: string, foodData: Partial<FoodRequest>, imageFile?: File): Promise<FoodResponse> => {
    if (imageFile) {
      // Update with new image
      const formData = new FormData();
      formData.append('food', JSON.stringify(foodData));
      formData.append('file', imageFile);

      const response = await apiUploadClient.put(`/foods/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Food updated successfully!');
      return response.data;
    } else {
      // Update without changing the image
      const response = await apiClient.put(`/foods/${id}`, foodData);
      toast.success('Food updated successfully!');
      return response.data;
    }
  },

  // Delete a food
  deleteFood: async (id: string): Promise<void> => {
    await apiClient.delete(`/foods/${id}`);
    toast.success('Food deleted successfully!');
  },
};

export default foodService;