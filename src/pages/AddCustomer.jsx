import { useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import axios from "axios";

import "./AddCustomer.css";

countries.registerLocale(en);

const countryList = Object.entries(
  countries.getNames("en")
);

function AddCustomer() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [country, setCountry] = useState("IN");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {

    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedVillage = village.trim();

    // ✅ Validation
    if (!trimmedName || !phone || !trimmedVillage) {
      setError("All fields are required");
      return;
    }

    if (trimmedName.split(" ").length < 2) {
      setError("Please enter full name with surname");
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(
      phone,
      country
    );

    if (!phoneNumber || !phoneNumber.isValid()) {
      setError("Invalid phone number");
      return;
    }

    try {

      const token = localStorage.getItem("token");

      // ✅ ✅ CHECK DUPLICATE BEFORE ADDING
      const res = await axios.get(
        "https://digital-khata-backend-yalb.onrender.com/customers",
        {
          headers: {
            Authorization: token
          }
        }
      );

      const customers = Array.isArray(res.data)
        ? res.data
        : res.data.customers || [];

      const alreadyExists = customers.some(
        (c) => c.phone === phoneNumber.number
      );

      if (alreadyExists) {
        setError("Customer with this phone already exists");
        return;
      }

      // ✅ ADD CUSTOMER
      await axios.post(
        "https://digital-khata-backend-yalb.onrender.com/customers",
        {
          name: trimmedName,
          phone: phoneNumber.number,
          village: trimmedVillage
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      // ✅ Success
      setSuccess("✅ Customer Added Successfully");

      // ✅ Reset form
      setName("");
      setPhone("");
      setVillage("");
      setCountry("IN");

      setTimeout(() => {
        setSuccess("");
      }, 4000);

    } catch (error) {

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to add customer");
      }

    }
  }

  return (
    <div className="page-container">

      <div className="form-card">

        <h2>Add Customer</h2>

        <form onSubmit={handleSubmit}>

          {/* ✅ Success */}
          {success && (
            <p className="success-message">{success}</p>
          )}

          {/* ✅ Error */}
          {error && (
            <p className="error">{error}</p>
          )}

          {/* ✅ Name */}
          <input
            type="text"
            placeholder="Full Name (Name + Surname)"
            value={name}
            onChange={(e) =>
              setName(e.target.value.replace(/\s+/g, " "))
            }
          />

          {/* ✅ Country */}
          <select
            value={country}
            onChange={(e) =>
              setCountry(e.target.value)
            }
          >
            {countryList.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>

          {/* ✅ Phone (FIXED) */}
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, ""))
            }
          />

          {/* ✅ Village */}
          <input
            type="text"
            placeholder="Village"
            value={village}
            onChange={(e) =>
              setVillage(e.target.value.replace(/\s+/g, " "))
            }
          />

          <button type="submit">
            Save Customer
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddCustomer;