import { useState, useEffect } from "react";
import "./Payments.css";
import API from "../api";

function Payments() {

  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState({
    customerId: "",
    amount: "",
    paymentDate: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ✅ Fetch customers */
  useEffect(() => {

    async function fetchCustomers() {
      try {

        const res = await API.get("/customers");

        const customersData = Array.isArray(res.data)
          ? res.data
          : res.data.customers || [];

        setCustomers(customersData);

      } catch (error) {
        console.log("Error fetching customers:", error);
      }
    }

    fetchCustomers();

  }, []);

  /* ✅ Default date */
  useEffect(() => {

    const today = new Date().toISOString().split("T")[0];

    setForm((prev) => ({
      ...prev,
      paymentDate: today
    }));

  }, []);

  /* ✅ Input Change */
  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  }

  /* ✅ Submit Payment */
  async function handleSubmit(e) {

    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.customerId || !form.amount || !form.paymentDate) {
      setError("All fields required");
      return;
    }

    try {

      await API.post("/transactions", {
        customerId: form.customerId,
        type: "PAYMENT",
        amount: Number(form.amount),
        date: new Date(form.paymentDate).toISOString(),
        createdAt: new Date().toISOString()
      });

      setSuccess("✅ Payment Added Successfully");

      setForm({
        customerId: "",
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0]
      });

      setTimeout(() => {
        setSuccess("");
      }, 4000);

    } catch (error) {
      console.log(error);
      setError("Failed to add payment");
    }
  }

  return (
    <div className="page-container">

      <div className="form-card">

        <h2>Add Payment</h2>

        <form onSubmit={handleSubmit}>

          {success && (
            <p className="success-message">{success}</p>
          )}

          {error && (
            <p className="error">{error}</p>
          )}

          {/* ✅ Customer Dropdown */}
          <select
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
          >

            <option value="">
              Select Customer
            </option>

            {customers.length > 0 &&
              customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.village})
                </option>
              ))}

          </select>

          {/* ✅ Amount */}
          <input
            type="number"
            name="amount"
            placeholder="Payment Amount"
            value={form.amount}
            onChange={handleChange}
          />

          {/* ✅ Date */}
          <input
            type="date"
            name="paymentDate"
            value={form.paymentDate}
            onChange={handleChange}
          />

          <button type="submit">
            Save Payment
          </button>

        </form>

      </div>

    </div>
  );
}

export default Payments;