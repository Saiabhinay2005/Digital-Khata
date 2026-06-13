import { useEffect, useState } from "react";
import "./History.css";
import API from "../api"; // ✅ FIX: use API

function History() {

  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  /* ✅ Fetch data */
  useEffect(() => {
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

      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  /* ✅ ✅ FIXED FILTER */
  const customerTransactions = transactions
    .filter(
      (tx) =>
        tx.customerId?.toString() === selectedCustomer?.toString()
    )
    .sort((a, b) => {

      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      const diff = dateA - dateB;
      if (diff !== 0) return diff;

      if (a.type === "KHATA" && b.type === "PAYMENT") return -1;
      if (a.type === "PAYMENT" && b.type === "KHATA") return 1;

      return 0;
    });

  /* ✅ Running balance */
  let runningBalance = 0;

  const processedTransactions = customerTransactions.map((tx) => {

    const amount = Number(tx.amount) || 0;

    if (tx.type === "KHATA") {
      runningBalance += amount;
    } else {
      runningBalance -= amount;
    }

    return {
      ...tx,
      runningBalance
    };
  });

  return (
    <div className="page-container">

      <div className="history">

        <h2>Customer History</h2>

        {/* ✅ Dropdown */}
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="">Select Customer</option>

          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.village})
            </option>
          ))}

        </select>

        {/* ✅ Empty */}
        {!selectedCustomer ? (
          <p className="empty-state">Select a customer</p>
        ) : processedTransactions.length === 0 ? (
          <p className="empty-state">No transactions found</p>
        ) : (

          <table className="history-table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Credit</th>
                <th>Payment</th>
                <th>Balance</th>
              </tr>
            </thead>

            <tbody>

              {processedTransactions.map((tx) => {

                const amount = Number(tx.amount) || 0;
                const isCredit = tx.type === "KHATA";

                return (
                  <tr key={tx._id}>

                    <td>
                      {new Date(tx.date).toLocaleDateString()}
                      {tx.createdAt && (
                        <div style={{ fontSize: "12px", color: "gray" }}>
                          Entered: {new Date(tx.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    <td>
                      {isCredit
                        ? `Given items: ${tx.items || "Items"}`
                        : "Customer Paid"}
                    </td>

                    <td style={{ color: "#e74c3c" }}>
                      {isCredit ? `₹${amount}` : "-"}
                    </td>

                    <td style={{ color: "#27ae60" }}>
                      {!isCredit ? `₹${amount}` : "-"}
                    </td>

                    <td>
                      {tx.runningBalance > 0 ? (
                        <span style={{ color: "red", fontWeight: "600" }}>
                          ₹{tx.runningBalance}
                        </span>
                      ) : tx.runningBalance < 0 ? (
                        <span style={{ color: "green", fontWeight: "600" }}>
                          ₹{Math.abs(tx.runningBalance)}
                        </span>
                      ) : (
                        <span style={{ fontWeight: "600" }}>
                          Balanced ✅
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default History;