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

    // ✅ Required validation
    if (!trimmedName || !phone || !trimmedVillage) {
      setError("All fields are required");
      return;
    }

    // ✅ Full name validation
    if (trimmedName.split(" ").length < 2) {
      setError("Please enter full name with surname");
      return;
    }

    // ✅ Phone validation
    const phoneNumber = parsePhoneNumberFromString(
      phone,
      country
    );

    if (!phoneNumber || !phoneNumber.isValid()) {
      setError("Invalid phone number");
      return;
    }

    try {

      await axios.post(
        "http://localhost:5000/customers",
        {
          name: trimmedName,
          phone: phoneNumber.number,
          village: trimmedVillage
        }
      );

      // ✅ Success Message
      setSuccess("✅ Customer Added Successfully");

      // ✅ Reset form
      setName("");
      setPhone("");
      setVillage("");
      setCountry("IN");

      // ✅ Auto-remove message after 4 sec
      setTimeout(() => {
        setSuccess("");
      }, 4000);

    } catch (error) {

      if (error.response?.data?.error) {
        setError(error.response.data.error);
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

          {/* Success */}
          {success && (
            <p className="success-message">
              {success}
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="error">
              {error}
            </p>
          )}

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name (Name + Surname)"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value.replace(/\s+/g, " ")
              )
            }
          />

          {/* Country */}
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

          {/* Phone */}
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value.replace(/\D/g, "")
              )
            }
          />

          {/* Village */}
          <input
            type="text"
            placeholder="Village"
            value={village}
            onChange={(e) =>
              setVillage(
                e.target.value.replace(/\s+/g, " ")
              )
            }
          />

          {/* Save Button */}
          <button type="submit">
            Save Customer
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddCustomer;
