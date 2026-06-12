import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import AddCustomer from "./pages/AddCustomer";
import AddKhata from "./pages/AddKhata";
import Payments from "./pages/Payments";
import History from "./pages/History";

import Navbar from "./components/Navbar/Navbar";
import BottomNav from "./components/BottomNav";


// ✅ PROTECTED ROUTE
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {

  const token = localStorage.getItem("token");

  return (
    <div>

      {/* ✅ Show Navbar ONLY when logged in */}
      {token && <Navbar />}

      <Routes>

        {/* ✅ PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ PROTECTED ROUTES */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/customers" element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        } />

        <Route path="/add-customer" element={
          <ProtectedRoute>
            <AddCustomer />
          </ProtectedRoute>
        } />

        <Route path="/add-khata" element={
          <ProtectedRoute>
            <AddKhata />
          </ProtectedRoute>
        } />

        <Route path="/payments" element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />


      </Routes>

      {/* ✅ Show BottomNav only when logged in */}
      {token && <BottomNav />}

    </div>
  );
}

export default App;
