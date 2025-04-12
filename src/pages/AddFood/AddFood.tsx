import React from 'react';
import PageHeading from '../../components/ui/PageHeading';

const AddFood = () => {
  // Example action buttons
  const actionButtons = (
    <>
      <button className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
        Cancel
      </button>
      <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
        Save Item
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
      
      {/* Food item form will go here */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        Form fields will go here...
      </div>
    </div>
  );
};

export default AddFood;