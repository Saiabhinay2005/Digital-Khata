import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";

import {
  FaUsers,
  FaMoneyBillWave,
  FaCalendarDay,
  FaWallet
} from "react-icons/fa";

function Dashboard() {

  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const customerRes = await axios.get(
          "https://digital-khata-backend-yalb.onrender.com/customers",
          { headers: { Authorization: token } }
        );

        const txRes = await axios.get(
          "https://digital-khata-backend-yalb.onrender.com/transactions",
          { headers: { Authorization: token } }
        );

        setCustomers(customerRes.data || []);
        setTransactions(txRes.data || []);

      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  /* ✅ CALCULATIONS */
  const totalCustomers = customers.length;

  const totalKhata = transactions
    .filter((tx) => tx.type === "KHATA")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const totalPayments = transactions
    .filter((tx) => tx.type === "PAYMENT")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const totalPending = totalKhata - totalPayments;

  const todayEntries = transactions.filter(
    (tx) =>
      new Date(tx.date).toDateString() ===
      new Date().toDateString()
  ).length;

  const recentTransactions = [...transactions]
    .slice(-5)
    .reverse();

  /* ✅ PENDING CUSTOMERS */
  const pendingCustomers = customers
    .map((customer) => {

      const customerTransactions = transactions.filter(
        (tx) => tx.customerId === customer._id
      );

      const khata = customerTransactions
        .filter((t) => t.type === "KHATA")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      const payments = customerTransactions
        .filter((t) => t.type === "PAYMENT")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      return {
        ...customer,
        balance: khata - payments
      };

    })
    .filter((c) => c.balance > 0);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard">

        <h1>Dashboard</h1>

        {/* ✅ TOP CARDS */}
        <div className="dashboard-grid">

          <div className="card">
            <div className="card-top">
              <FaUsers className="card-icon" />
              <h3>Total Customers</h3>
            </div>
            <h2>{totalCustomers}</h2>
          </div>

          <div className="card">
            <div className="card-top">
              <FaMoneyBillWave className="card-icon" />
              <h3>Total Pending</h3>
            </div>
            <h2>₹{totalPending}</h2>
          </div>

          <div className="card">
            <div className="card-top">
              <FaCalendarDay className="card-icon" />
              <h3>Today's Entries</h3>
            </div>
            <h2>{todayEntries}</h2>
          </div>

          <div className="card">
            <div className="card-top">
              <FaWallet className="card-icon" />
              <h3>Total Payments</h3>
            </div>
            <h2>₹{totalPayments}</h2>
          </div>

        </div>

        {/* ✅ MAIN LAYOUT */}
        <div className="dashboard-layout">

          {/* ✅ LEFT */}
          <div className="left-section">
            <section>
              <h2>Recent Transactions</h2>

              {recentTransactions.length === 0 ? (
                <p className="empty-state">No Transactions Yet 📭</p>
              ) : (
                recentTransactions.map((tx) => {

                  const customer = customers.find(
                    (c) => c._id === tx.customerId
                  );

                  return (
                    <div className="transaction-card" key={tx._id}>

                      <span>{customer?.name || "Unknown"}</span>

                      <span>
                        {tx.type === "KHATA"
                          ? `Took: ${tx.items || "Items"}`
                          : "Paid"}
                      </span>

                      <span
                        style={{
                          color: tx.type === "KHATA"
                            ? "#dc2626"
                            : "#16a34a",
                          fontWeight: "600"
                        }}
                      >
                        {tx.type === "KHATA" ? "-" : "+"} ₹{tx.amount}
                      </span>

                      <span>
                        {new Date(tx.date).toLocaleDateString()}
                      </span>

                    </div>
                  );
                })
              )}
            </section>
          </div>

          {/* ✅ RIGHT */}
          <div className="right-section">

            {/* ✅ Quick Actions */}
            <section>
              <h2>Quick Actions</h2>

              <div className="quick-actions">
                <Link to="/add-customer"><button>Add Customer</button></Link>
                <Link to="/add-khata"><button>Add Khata</button></Link>
                <Link to="/payments"><button>Add Payment</button></Link>
              </div>
            </section>

            {/* ✅ ✅ Pending Customers with RED color */}
            <section>
              <h2>Pending Customers</h2>

              {pendingCustomers.length === 0 ? (
                <p className="empty-state">
                  No Pending Customers ✅
                </p>
              ) : (
                pendingCustomers.map((c) => (
                  <div className="pending-card" key={c._id}>
                    <span>{c.name}</span>

                    {/* ✅ FINAL FIX */}
                    <span
                      style={{
                        color: "#dc2626",
                        fontWeight: "600"
                      }}
                    >
                      ₹{c.balance}
                    </span>

                  </div>
                ))
              )}

            </section>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;