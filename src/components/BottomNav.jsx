import { NavLink } from "react-router-dom";
import "./BottomNav.css";

import {
  FaHome,
  FaUsers,
  FaPlus,
  FaMoneyBillWave,
  FaHistory
} from "react-icons/fa";

function BottomNav() {

  return (
    <div className="bottom-nav">

      <NavLink to="/" className="nav-item">
        <FaHome />
        <span>Home</span>
      </NavLink>

      <NavLink to="/customers" className="nav-item">
        <FaUsers />
        <span>Customers</span>
      </NavLink>

      <NavLink to="/add-khata" className="nav-item">
        <FaPlus />
        <span>Khata</span>
      </NavLink>

      <NavLink to="/payments" className="nav-item">
        <FaMoneyBillWave />
        <span>Payment</span>
      </NavLink>

      <NavLink to="/history" className="nav-item">
        <FaHistory />
        <span>History</span>
      </NavLink>

    </div>
  );
}

export default BottomNav;
