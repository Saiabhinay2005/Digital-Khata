import { useEffect, useState } from "react";
import "./Customers.css";
import API from "../api";

import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaTrash,
  FaBell
} from "react-icons/fa";

function Customers() {

  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [viewType, setViewType] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  /* ✅ Fetch Data */
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {

      const customerRes = await API.get("/customers");
      const txRes = await API.get("/transactions");

      const customersData = Array.isArray(customerRes.data)
        ? customerRes.data
        : customerRes.data.customers || [];

      const transactionsData = Array.isArray(txRes.data)
        ? txRes.data
        : txRes.data.transactions || [];

      setCustomers(customersData);
      setTransactions(transactionsData);

      console.log("Customers:", customersData);
      console.log("Transactions:", transactionsData);

    } catch (err) {
      console.log("Error:", err);
    }
  }

  /* ✅ Delete Customer */
  async function handleDeleteCustomer(id) {
    try {

      await API.delete(`/customers/${id}`);

      setCustomers(customers.filter((c) => c._id !== id));

      setTransactions(
        transactions.filter((tx) => tx.customerId !== id)
      );

    } catch (err) {
      console.log(err);
    }
  }

  /* ✅ WhatsApp Reminder */
  const sendReminder = (customer, balance) => {

    const shopName = localStorage.getItem("name") || "Shop";

    const message = `
నమస్తే ${customer.name} గారు,

మీకు ₹${balance} బాకీ ఉంది.

దయచేసి త్వరగా చెల్లించండి.

- ${shopName}
`;

    const cleanedPhone =
      (customer.phone || "")
        .replace(/\D/g, "")
        .slice(-10);

    const whatsappURL =
      `https://wa.me/91${cleanedPhone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
  };

  /* ✅ Search */
  const filteredCustomers = customers.filter((c) => {

    const searchText = search.toLowerCase();

    return (
      (c.name || "").toLowerCase().includes(searchText) ||
      (c.phone || "").includes(search) ||
      (c.village || "").toLowerCase().includes(searchText)
    );
  });

  /* ✅ Filter */
  const visibleCustomers = filteredCustomers.filter((c) => {

    const txs = transactions.filter(
      (tx) =>
        tx.customerId?.toString() === c._id?.toString()
    );

    const totalKhata = txs
      .filter((tx) => tx.type === "KHATA")
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const totalPayments = txs
      .filter((tx) => tx.type === "PAYMENT")
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const balance = totalKhata - totalPayments;

    if (viewType === "pending") return balance > 0;
    if (viewType === "advance") return balance < 0;

    return true;
  });

  return (
    <div className="customers">

      <h2>Customers</h2>

      {/* ✅ Search */}
      <input
        type="text"
        placeholder="Search by name, phone or village..."
        className="search-box"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ✅ Filters */}
      <div className="toggle-container">
        <button
          className={viewType === "all" ? "active" : ""}
          onClick={() => setViewType("all")}
        >
          All
        </button>

        <button
          className={viewType === "pending" ? "active" : ""}
          onClick={() => setViewType("pending")}
        >
          Pending
        </button>

        <button
          className={viewType === "advance" ? "active" : ""}
          onClick={() => setViewType("advance")}
        >
          Advance
        </button>
      </div>

      {/* ✅ Customer List */}
      <div className="customer-list">

        {visibleCustomers.length === 0 ? (

          <div className="empty-state">
            <p>No Customers Found 📭</p>

            <a href="/add-customer" className="add-btn">
              ➕ Add Customer
            </a>
          </div>

        ) : (

          visibleCustomers.map((c) => {

            const txs = transactions.filter(
              (tx) =>
                tx.customerId?.toString() === c._id?.toString()
            );

            const totalKhata = txs
              .filter((tx) => tx.type === "KHATA")
              .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

            const totalPayments = txs
              .filter((tx) => tx.type === "PAYMENT")
              .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

            const balance = totalKhata - totalPayments;

            return (
              <div className="customer-card" key={c._id}>

                <div className="customer-info">
                  <h4>{c.name}</h4>

                  <p className="info-row">
                    <FaPhoneAlt className="info-icon" />
                    {c.phone}
                  </p>

                  <p className="info-row">
                    <FaMapMarkerAlt className="info-icon" />
                    {c.village}
                  </p>

                  {balance > 0 ? (
                    <p className="balance balance-pending">
                      Pending ₹{balance}
                    </p>
                  ) : balance < 0 ? (
                    <p className="balance balance-advance">
                      Advance ₹{Math.abs(balance)}
                    </p>
                  ) : (
                    <p className="balance balance-clear">
                      Balanced ✅
                    </p>
                  )}
                </div>

                <div className="btn-group">

                  {balance > 0 && (
                    <button
                      className="reminder-btn"
                      onClick={() => sendReminder(c, balance)}
                    >
                      <FaBell /> Reminder
                    </button>
                  )}

                  <button
                    className="delete-btn"
                    onClick={() => {
                      setSelectedCustomer(c);
                      setShowModal(true);
                    }}
                  >
                    <FaTrash /> Delete
                  </button>

                </div>
              </div>
            );
          })

        )}

      </div>

      {/* ✅ Delete Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="delete-modal">

            <h3>Delete Customer?</h3>

            <p>
              Are you sure you want to delete
              <strong> {selectedCustomer?.name}</strong>?
            </p>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-delete-btn"
                onClick={() => {
                  handleDeleteCustomer(selectedCustomer._id);
                  setShowModal(false);
                }}
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Customers;
