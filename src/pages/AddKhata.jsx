import { useState, useEffect } from "react";
import "./AddKhata.css";
import axios from "axios";

function AddKhata() {

  const [customers, setCustomers] = useState([]);
  const [voiceText, setVoiceText] = useState("");
  const [matchedList, setMatchedList] = useState([]);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = SpeechRecognition
    ? new SpeechRecognition()
    : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
  }

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    customerId: "",
    amount: "",
    items: "",
    remarks: "",
    date: today
  });

  /* ✅ FETCH CUSTOMERS */
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(
      "https://digital-khata-backend-yalb.onrender.com/customers",
      { headers: { Authorization: token } }
    )
    .then(res => setCustomers(res.data))
    .catch(() => setError("Failed to load customers"));

  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  /* ✅ VOICE INPUT FIXED */
  function startVoice(lang) {

    if (!recognition) {
      setError("Voice not supported");
      return;
    }

    recognition.lang = lang;
    recognition.start();

    recognition.onstart = () => {
      setVoiceText("🎤 Listening...");
    };

    recognition.onresult = (event) => {

      let text = event.results[0][0].transcript.toLowerCase();

      setVoiceText(`✅ ${text}`);

      /* ✅ remove noise words */
      text = text.replace(/\b(say|add|for|took|taken)\b/g, "").trim();

      /* ✅ extract amount */
      const nums = text.match(/\d+/g);
      let amount = "";

      if (nums) {
        amount = nums[nums.length - 1];

        setForm(prev => ({
          ...prev,
          amount
        }));
      }

      /* ✅ detect customer */
      let selectedCustomer = null;

      for (let c of customers) {
        const parts = c.name.toLowerCase().split(" ");

        if (parts.some(p => text.includes(p))) {
          selectedCustomer = c;
          break;
        }
      }

      if (selectedCustomer) {
        setForm(prev => ({
          ...prev,
          customerId: selectedCustomer._id
        }));

        /* ✅ remove ALL name parts cleanly */
        const parts = selectedCustomer.name.toLowerCase().split(" ");

        parts.forEach(p => {
          text = text.replace(new RegExp(`\\b${p}\\b`, "g"), "");
        });
      }

      /* ✅ remove amount */
      if (amount) {
        text = text.replace(amount, "");
      }

      /* ✅ clean remaining text */
      let words = text
        .split(" ")
        .map(w => w.trim())
        .filter(w => w.length > 2);

      /* ✅ fix common speech mistakes */
      words = words.map(w =>
        w === "rise" ? "rice" : w
      );

      /* ✅ remove duplicates */
      words = [...new Set(words)];

      /* ✅ build final items */
      const finalItems = words.join(" ");

      if (finalItems) {
        setForm(prev => ({
          ...prev,
          items: finalItems
        }));
      }
    };

    recognition.onerror = () => {
      setVoiceText("❌ Try again");
    };
  }

  /* ✅ SUBMIT */
  async function handleSubmit(e) {

    e.preventDefault();

    setSuccess("");
    setError("");

    if (!form.customerId || !form.amount) {
      setError("Please fill required fields");
      return;
    }

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "https://digital-khata-backend-yalb.onrender.com/transactions",
        {
          ...form,
          type: "KHATA",
          amount: Number(form.amount)
        },
        {
          headers: { Authorization: token }
        }
      );

      setSuccess("✅ Khata Added Successfully");

      setForm({
        customerId: "",
        amount: "",
        items: "",
        remarks: "",
        date: today
      });

      setVoiceText("");
      setMatchedList([]);

      setTimeout(() => setSuccess(""), 4000);

    } catch {
      setError("Failed to save khata");
    }
  }

  return (
    <div className="page-container">
      <div className="form-card">

        <h2>Add Khata Entry</h2>

        <form onSubmit={handleSubmit}>

          {success && <p className="success-message">{success}</p>}
          {error && <p className="error">{error}</p>}

          {/* ✅ CUSTOMER */}
          <select
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
          >
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.village})
              </option>
            ))}
          </select>

          {/* ✅ AMOUNT */}
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
          />

          {/* ✅ DATE */}
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          {/* ✅ ITEMS */}
          <div className="items-container">
            <input
              type="text"
              name="items"
              placeholder="Enter items manually or use voice..."
              value={form.items}
              onChange={handleChange}
            />

            <div className="voice-buttons">
              <button type="button" onClick={() => startVoice("te-IN")}>
                🎤 తెలుగు
              </button>
              <button type="button" onClick={() => startVoice("en-IN")}>
                🎤 English
              </button>
            </div>
          </div>

          {voiceText && <p className="voice-text">{voiceText}</p>}

          <input
            type="text"
            name="remarks"
            placeholder="Remarks"
            value={form.remarks}
            onChange={handleChange}
          />

          <button type="submit">Save Khata</button>

        </form>
      </div>
    </div>
  );
}

export default AddKhata;