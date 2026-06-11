import { useEffect, useState } from "react";
import "./History.css";
import axios from "axios";

function History() {

  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  /* ✅ Fetch data */
  useEffect(() => {
    async function fetchData() {
      try {
        const customerRes = await axios.get("https://digital-khata-backend-yalb.onrender.com/customers");
        const txRes = await axios.get("https://digital-khata-backend-yalb.onrender.com/transactions");

        setCustomers(customerRes.data);
        setTransactions(txRes.data);

      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  /* ✅ ✅ IMPROVED SORTING (supports paymentDate in future) */
  const customerTransactions = transactions
    .filter((tx) => tx.customerId === selectedCustomer)
    .sort((a, b) => {

      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      const dateDiff = dateA - dateB;
      if (dateDiff !== 0) return dateDiff;

      // ✅ SAME DATE → KHATA first, PAYMENT after
      if (a.type === "KHATA" && b.type === "PAYMENT") return -1;
      if (a.type === "PAYMENT" && b.type === "KHATA") return 1;

      return 0;
    });

  /* ✅ ✅ Correct balance */
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

        {/* ✅ Select Customer */}
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

                    {/* ✅ DATE (MAIN FIX HERE) */}
                    <td>
                      {new Date(tx.date).toLocaleDateString()}

                      {/* ✅ OPTIONAL: Show entry date */}
                      {tx.createdAt && (
                        <div style={{ fontSize: "12px", color: "gray" }}>
                          Entered: {new Date(tx.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    {/* ✅ Description */}
                    <td>
                      {isCredit
                        ? `Given items: ${tx.items || "Items"}`
                        : "Customer Paid"}
                    </td>

                    {/* ✅ Credit */}
                    <td style={{ color: "#e74c3c" }}>
                      {isCredit ? `₹${amount}` : "-"}
                    </td>

                    {/* ✅ Payment */}
                    <td style={{ color: "#27ae60" }}>
                      {!isCredit ? `₹${amount}` : "-"}
                    </td>

                    {/* ✅ Balance */}
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
