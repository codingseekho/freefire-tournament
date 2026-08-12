import React, { useState } from "react";

const UPI_ID = "6207013767@ybl";
const PAYEE_NAME = "AMBIKA KUMARI";

function Payment({ amount, tournamentId }) {
  const [utr, setUtr] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const upiLink =
    `upi://pay?pa=${UPI_ID}` +
    `&pn=${encodeURIComponent(PAYEE_NAME)}` +
    `&am=${amount}` +
    `&cu=INR`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!utr.trim()) {
      alert("Please enter UTR / Transaction ID");
      return;
    }

    try {
      const response = await fetch(
  "https://custom-tournament-backend.onrender.com/api/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tournamentId,
            amount,
            utr: utr.trim(),
            upiId: UPI_ID,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment submission failed");
      }

      setSubmitted(true);
      alert("Payment details submitted successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  if (submitted) {
    return (
      <div className="payment-success">
        <h2>✅ Payment Submitted</h2>
        <p>Your payment is waiting for verification.</p>
        <p>UTR: {utr}</p>
      </div>
    );
  }

  return (
    <div className="payment-box">
      <h2>💳 Tournament Payment</h2>

      <h3>Entry Fee: ₹{amount}</h3>

      <img
        src="/payment-qr.png"
        alt="UPI Payment QR"
        className="payment-qr"
      />

      <p>Scan with any UPI app</p>

      <a href={upiLink} className="upi-pay-button">
        📱 Pay ₹{amount} with UPI
      </a>

      <p className="upi-id">
        UPI ID: <strong>{UPI_ID}</strong>
      </p>

      <hr />

      <form onSubmit={handleSubmit}>
        <label>Enter UTR / Transaction ID</label>

        <input
          type="text"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          placeholder="Enter 12-digit UTR"
          required
        />

        <button type="submit">
          Submit Payment
        </button>
      </form>
    </div>
  );
}

export default Payment;