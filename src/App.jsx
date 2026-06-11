import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import AddCustomer from "./pages/AddCustomer";
import AddKhata from "./pages/AddKhata";
import Payments from "./pages/Payments";
import History from "./pages/History";

import Navbar from "./components/Navbar/Navbar";
import BottomNav from "./components/BottomNav";

function App() {
  return (
    <div>

      <Navbar />

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/customers" element={<Customers />} />

        <Route path="/add-customer" element={<AddCustomer />} />

        <Route path="/add-khata" element={<AddKhata />} />

        <Route path="/payments" element={<Payments />} />

        <Route path="/history" element={<History />} />

      </Routes>

      {/* ✅ ADD THIS */}
      <BottomNav />

    </div>
  );
}

export default App;
