import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Addresses from './pages/Addresses';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <h1 className="logo">Mini CRM System</h1>
          <div className="nav-links">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/customers" className="nav-link">Customers</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/orders" className="nav-link">Orders</Link>
            <Link to="/addresses" className="nav-link">Addresses</Link>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/addresses" element={<Addresses />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
