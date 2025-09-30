// src/config.js
const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://phone-lookup-backend.onrender.com" // Replace with deployed Flask URL
    : "http://127.0.0.1:5000";

export default API_BASE;
