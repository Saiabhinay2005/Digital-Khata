import { useState, useEffect } from "react";
import "./AddKhata.css";
import axios from "axios";

function AddKhata() {

  const [customers, setCustomers] = useState([]);
  const [voiceText, setVoiceText] = useState("");

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

  useEffect(() => {
    axios
      .get("http://localhost:5000/customers")
      .then((res) => setCustomers(res.data));
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  // ✅ Voice Input
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

      const text =
        event.results[0][0].transcript;

      setVoiceText(`✅ ${text}`);

      // ✅ Fill items
      setForm((prev) => ({
        ...prev,
        items: text
      }));

      // ✅ Extract amount
      const nums = text.match(/\d+/g);

      if (nums) {
        setForm((prev) => ({
          ...prev,
          amount: nums[nums.length - 1]
        }));
      }
    };

    recognition.onerror = () => {
      setVoiceText("❌ Try again");
    };
  }

  // ✅ Submit
  async function handleSubmit(e) {

    e.preventDefault();

    setSuccess("");
    setError("");

    if (!form.customerId || !form.amount) {
      setError("Please fill required fields");
      return;
    }

    try {

      await axios.post(
        "http://localhost:5000/transactions",
        {
          ...form,
          type: "KHATA",
          amount: Number(form.amount)
        }
      );

      // ✅ Success Message
      setSuccess("✅ Khata Added Successfully");

      // ✅ Reset Form
      setForm({
        customerId: "",
        amount: "",
        items: "",
        remarks: "",
        date: today
      });

      setVoiceText("");

      // ✅ Auto Remove
      setTimeout(() => {
        setSuccess("");
      }, 4000);

    } catch (err) {
      setError("Failed to save khata");
    }
  }

  return (
    <div className="page-container">

      <div className="form-card">

        <h2>Add Khata Entry</h2>

        <form onSubmit={handleSubmit}>

          {/* ✅ Success Message */}
          {success && (
            <p className="success-message">
              {success}
            </p>
          )}

          {/* ✅ Error Message */}
          {error && (
            <p className="error">
              {error}
            </p>
          )}

          {/* ✅ Customer */}
          <select
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
          >
            <option value="">
              Select Customer
            </option>

            {customers.map((c) => (
              <option
                key={c._id}
                value={c._id}
              >
                {c.name} ({c.village})
              </option>
            ))}
          </select>

          {/* ✅ Amount */}
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
          />

          {/* ✅ Date */}
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          {/* ✅ Items */}
          <div className="items-container">

            <input
              type="text"
              name="items"
              placeholder="Enter items manually or use voice..."
              value={form.items}
              onChange={handleChange}
            />

            {/* ✅ Voice Buttons */}
            <div className="voice-buttons">

              <button
                type="button"
                onClick={() => startVoice("te-IN")}
              >
                🎤 తెలుగు
              </button>

              <button
                type="button"
                onClick={() => startVoice("en-IN")}
              >
                🎤 English
              </button>

            </div>
          </div>

          {/* ✅ Voice Feedback */}
          {voiceText && (
            <p className="voice-text">
              {voiceText}
            </p>
          )}

          {/* ✅ Remarks */}
          <input
            type="text"
            name="remarks"
            placeholder="Remarks"
            value={form.remarks}
            onChange={handleChange}
          />

          {/* ✅ Submit */}
          <button type="submit">
            Save Khata
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddKhata;