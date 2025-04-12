import React from 'react';
import PageHeading from '../../components/ui/PageHeading';

const ListFood = () => {
  // Example action button
  const addButton = (
    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
      Add New Item
    </button>
  );

  return (
    <div>
      <PageHeading 
        title="Food Items" 
        subtitle="View and manage all food items in the inventory"
        actions={addButton}
      />
      
      {/* Rest of the food listing content will go here */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        Food items list content...
      </div>
    </div>
  );
};

export default ListFood;