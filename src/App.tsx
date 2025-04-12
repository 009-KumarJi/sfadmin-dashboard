import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AddFood from './pages/AddFood/AddFood';
import ListFood from './pages/ListFood/ListFood';
import Orders from './pages/Orders/Orders';

function App() {
  return (
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
          <Route path="/orders" element={
            <MainLayout>
              <Orders />
            </MainLayout>
          } />
          {/* Auth routes can be added here later */}
        </Routes>
  );
}

export default App;
