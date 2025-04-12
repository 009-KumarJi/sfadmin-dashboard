import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AddFood from './pages/AddFood/AddFood';
import ListFood from './pages/ListFood/ListFood';
import FoodDetails from './pages/FoodDetails/FoodDetails';
import Orders from './pages/Orders/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={
          <MainLayout>
            <ListFood />
          </MainLayout>
        } />
        <Route path="/add-food" element={
          <MainLayout>
            <AddFood />
          </MainLayout>
        } />
        <Route path="/list-foods" element={
          <MainLayout>
            <ListFood />
          </MainLayout>
        } />
        <Route path="/food/:id" element={
          <MainLayout>
            <FoodDetails />
          </MainLayout>
        } />
        <Route path="/orders" element={
          <MainLayout>
            <Orders />
          </MainLayout>
        } />
        {/* Auth routes can be added here later */}
      </Routes>
    </>
  );
}

export default App;
