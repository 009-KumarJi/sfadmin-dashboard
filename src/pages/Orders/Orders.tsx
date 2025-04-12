import React from 'react';
import PageHeading from '../../components/ui/PageHeading';

const Orders = () => {
  // Example action buttons for the orders page
  const actionButtons = (
    <>
      <button className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base">
        Export
      </button>
      <button className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm sm:text-base">
        New Order
      </button>
    </>
  );

  return (
    <div>
      <PageHeading 
        title="Customer Orders" 
        subtitle="View and manage all customer orders"
        actions={actionButtons}
      />
      
      {/* Orders list content will go here */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 overflow-hidden">
        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="mb-2 sm:mb-0">
                <h3 className="font-medium">Order #12345</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">April 12, 2025 • $45.99</p>
              </div>
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400 self-start sm:self-auto w-max">
                Delivered
              </span>
            </div>
          </div>
          
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="mb-2 sm:mb-0">
                <h3 className="font-medium">Order #12344</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">April 11, 2025 • $32.50</p>
              </div>
              <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400 self-start sm:self-auto w-max">
                In Progress
              </span>
            </div>
          </div>
          
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="mb-2 sm:mb-0">
                <h3 className="font-medium">Order #12343</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">April 10, 2025 • $24.99</p>
              </div>
              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400 self-start sm:self-auto w-max">
                Preparing
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;