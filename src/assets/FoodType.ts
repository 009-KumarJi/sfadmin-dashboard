export enum FoodType {
  VEG = "VEG",
  NON_VEG = "NON_VEG",
  EGG = "EGG"
}

export const foodTypeDisplayNames: Record<FoodType, string> = {
  [FoodType.VEG]: "Vegetarian",
  [FoodType.NON_VEG]: "Non-Vegetarian",
  [FoodType.EGG]: "Contains Egg"
};