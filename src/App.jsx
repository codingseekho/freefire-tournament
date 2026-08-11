import { useState } from "react";
import "./App.css";
import { apiRequest } from "./api";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [screen, setScreen] = useState("home");

  const [playerName, setPlayerName] = useState("");
  const [uid, setUid] = useState("");
  const [verifyingUid, setVerifyingUid] = useState(false);

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [winner, setWinner] = useState("");

  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  // ============================================================
  // VERIFY FREE FIRE UID
  // ============================================================
  async function handleContinueToPayment() {
    const cleanPlayerName = playerName.trim();
    const cleanUid = uid.trim();

    if (!cleanPlayerName || !cleanUid) {
      alert("Please enter Player Name and Free Fire UID.");
      return;
    }

    if (!/^\d{6,15}$/.test(cleanUid)) {
      alert("Invalid Free Fire UID format.");
      return;
    }

    setVerifyingUid(true);

    try {
      const data = await apiRequest(
        `/registrations/verify-uid/${encodeURIComponent(cleanUid)}`
      );

      if (!data.success || !data.valid) {
        alert(data.message || "Invalid Free Fire UID.");
        return;
      }

      console.log("Verified Free Fire Player:", data.player);

      if (data.player?.playerName) {
        setPlayerName(data.player.playerName);
      }

      setScreen("payment");
    } catch (error) {
      console.error("UID verification error:", error);

      alert(
        error.message ||
          "Unable to verify Free Fire UID. Please try again."
      );
    } finally {
      setVerifyingUid(false);
    }
  }

  // ============================================================
  // PHONEPE PAYMENT
  // ============================================================
  function handlePaymentDone() {
    if (paymentSubmitting) return;

    const cleanPlayerName = playerName.trim();
    const cleanUid = uid.trim();

    if (!cleanPlayerName || !cleanUid) {
      alert("Player details are missing. Please go back and try again.");
      setScreen("registration");
      return;
    }

    setPaymentSubmitting(true);

    /*
      IMPORTANT:
      This button records the user's payment confirmation in the UI.
      A static PhonePe QR cannot automatically verify whether money
      was actually received.

      For automatic real-payment verification, connect this step to
      a payment gateway/merchant backend and verify the payment on
      the server before confirming the tournament slot.
    */

    setTimeout(() => {
      setPaymentSubmitting(false);
      setScreen("confirmed");
    }, 500);
  }

  // ============================================================
  // ADMIN LOGIN
  // ============================================================
  if (screen === "admin-login") {
    return (
      <div className="app">
        <main className="content admin-page">
          <div className="admin-logo">🛡️</div>

          <h1>Admin Login</h1>

          <p className="admin-subtitle">
            Manage your tournaments and players
          </p>

          <section className="admin-login-card">
            <label>📧 Admin Email</label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />

            <label>🔐 Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />

            <button
              className="join-button admin-login-button"
              onClick={() => {
                if (
                  adminEmail === "admin@customtournament.com" &&
                  adminPassword === "admin123"
                ) {
                  setAdminLoggedIn(true);
                  setScreen("admin");
                } else {
                  alert("Invalid admin email or password");
                }
              }}
            >
              LOGIN TO ADMIN PANEL →
            </button>
          </section>

          <button
            className="admin-back"
            onClick={() => setScreen("home")}
          >
            ← Back to Player App
          </button>
        </main>
      </div>
    );
  }

  // ============================================================
  // ADMIN DASHBOARD
  // ============================================================
  if (screen === "admin" && adminLoggedIn) {
    return (
      <div className="app">
        <main className="content admin-page">
          <div className="admin-header">
            <div>
              <p className="small-text">Organizer Panel</p>
              <h1>Admin Dashboard</h1>
            </div>

            <button
              className="admin-logout"
              onClick={() => {
                setAdminLoggedIn(false);
                setAdminEmail("");
                setAdminPassword("");
                setScreen("home");
              }}
            >
              Logout
            </button>
          </div>

          <section className="admin-tournament-card">
            <div className="admin-tournament-top">
              <div className="match-game-icon">🔥</div>

              <div>
                <h3>Free Fire Custom #01</h3>
                <p>Today • 8:00 PM</p>
              </div>

              <span className="confirmed-badge">LIVE</span>
            </div>

            <div className="admin-stats">
              <div>
                <span>PLAYERS</span>
                <strong>38/50</strong>
              </div>

              <div>
                <span>ENTRY</span>
                <strong>₹50</strong>
              </div>

              <div>
                <span>PRIZE</span>
                <strong>₹1,000</strong>
              </div>
            </div>
          </section>

          <section className="admin-section">
            <div className="admin-section-title">
              <h3>👥 Registered Players</h3>
              <span>38 Players</span>
            </div>

            <div className="player-admin-card">
              <div className="player-avatar">P</div>

              <div className="player-admin-info">
                <h4>{playerName || "Player"}</h4>
                <p>UID: {uid || "Not provided"}</p>
                <small>Payment Pending</small>
              </div>

              <strong className="slot-admin">#39</strong>
            </div>

            <div className="player-admin-card">
              <div className="player-avatar">A</div>

              <div className="player-admin-info">
                <h4>Aman Gamer</h4>
                <p>UID: 874563210</p>
                <small>Payment Confirmed</small>
              </div>

              <strong className="slot-admin">#38</strong>
            </div>

            <div className="player-admin-card">
              <div className="player-avatar">R</div>

              <div className="player-admin-info">
                <h4>Rahul FF</h4>
                <p>UID: 923456781</p>
                <small>Payment Confirmed</small>
              </div>

              <strong className="slot-admin">#37</strong>
            </div>

            <button
              className="admin-view-button"
              onClick={() =>
                alert("Full player list will be connected to backend.")
              }
            >
              VIEW ALL 38 PLAYERS →
            </button>
          </section>

          <section className="admin-section">
            <div className="admin-section-title">
              <h3>🎮 Room Details</h3>
              <span>Organizer</span>
            </div>

            <label className="admin-label">Room ID</label>

            <input
              className="admin-input"
              type="text"
              placeholder="Enter Free Fire Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />

            <label className="admin-label">Room Password</label>

            <input
              className="admin-input"
              type="text"
              placeholder="Enter room password"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
            />

            <button
              className="join-button admin-save-button"
              onClick={() => alert("Room details saved in demo mode.")}
            >
              SAVE ROOM DETAILS
            </button>
          </section>

          <section className="admin-section">
            <div className="admin-section-title">
              <h3>🏆 Winner</h3>
              <span>Prize ₹1,000</span>
            </div>

            <label className="admin-label">Select Winner</label>

            <select
              className="admin-input"
              value={winner}
              onChange={(e) => setWinner(e.target.value)}
            >
              <option value="">Select player</option>

              <option value="Aman Gamer">
                #38 — Aman Gamer
              </option>

              <option value="Rahul FF">
                #37 — Rahul FF
              </option>

              <option value={playerName || "Player"}>
                #39 — {playerName || "Player"}
              </option>
            </select>

            <div className="winner-preview">
              <span>🏆</span>

              <div>
                <small>Selected Winner</small>

                <strong>
                  {winner || "No winner selected"}
                </strong>
              </div>
            </div>

            <button
              className="join-button winner-button"
              onClick={() => {
                if (!winner) {
                  alert("Please select a winner.");
                  return;
                }

                alert(`${winner} selected as tournament winner.`);
              }}
            >
              CONFIRM WINNER
            </button>
          </section>

          <div className="admin-warning">
            ⚠️ Demo admin panel. Real payment, player data, winner payout
            and authentication must be handled securely through a backend.
          </div>
        </main>
      </div>
    );
  }

  // ============================================================
  // TOURNAMENT DETAILS
  // ============================================================
  if (screen === "details") {
    return (
      <div className="app">
        <main className="content">
          <div className="details-header">
            <button
              className="back-button"
              onClick={() => setScreen("home")}
            >
              ←
            </button>

            <h2>Tournament Details</h2>

            <button className="share-button">↗</button>
          </div>

          <section className="details-banner">
            <div className="live-badge">● LIVE REGISTRATION</div>

            <h1>FREE FIRE</h1>

            <h2>CUSTOM BATTLE</h2>

            <p>50 Players • Custom Room</p>
          </section>

          <div className="details-stats">
            <div>
              <span>ENTRY FEE</span>
              <strong>₹50</strong>
            </div>

            <div>
              <span>PRIZE</span>
              <strong>₹1,000</strong>
            </div>

            <div>
              <span>SLOTS</span>
              <strong>38/50</strong>
            </div>
          </div>

          <section className="info-section">
            <h3>Tournament Information</h3>

            <div className="info-row">
              <span>🕐 Date & Time</span>
              <strong>Today • 8:00 PM</strong>
            </div>

            <div className="info-row">
              <span>🎮 Game</span>
              <strong>Free Fire</strong>
            </div>

            <div className="info-row">
              <span>👥 Players</span>
              <strong>50 Players</strong>
            </div>

            <div className="info-row">
              <span>🏆 Winner Prize</span>
              <strong>₹1,000</strong>
            </div>
          </section>

          <section className="slots-section">
            <div className="slots-heading">
              <h3>Available Slots</h3>
              <span>38 / 50</span>
            </div>

            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>

            <p>12 slots remaining</p>
          </section>

          <section className="rules-section">
            <h3>📋 Tournament Rules</h3>

            <div className="rule">
              <span>1</span>
              <p>Player must join the custom room on time.</p>
            </div>

            <div className="rule">
              <span>2</span>
              <p>Only registered players can participate.</p>
            </div>

            <div className="rule">
              <span>3</span>
              <p>
                Room ID and password will be provided after registration.
              </p>
            </div>

            <div className="rule">
              <span>4</span>
              <p>Winner will receive the announced prize.</p>
            </div>
          </section>

          <div className="details-bottom">
            <div>
              <small>Entry Fee</small>
              <strong>₹50</strong>
            </div>

            <button
              className="join-button"
              onClick={() => setScreen("registration")}
            >
              JOIN NOW →
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ============================================================
  // REGISTRATION
  // ============================================================
  if (screen === "registration") {
    return (
      <div className="app">
        <main className="content registration-page">
          <div className="details-header">
            <button
              className="back-button"
              onClick={() => setScreen("details")}
            >
              ←
            </button>

            <h2>Player Registration</h2>

            <div style={{ width: "40px" }}></div>
          </div>

          <section className="registration-intro">
            <div className="registration-icon">🎮</div>

            <h1>Join Custom Battle</h1>

            <p>
              Enter your details to reserve your tournament slot.
            </p>
          </section>

          <section className="form-card">
            <label>👤 Player Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />

            <label>🎮 Free Fire UID</label>

            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter your Free Fire UID"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
            />
          </section>

          <section className="registration-summary">
            <h3>Tournament Summary</h3>

            <div className="summary-row">
              <span>Tournament</span>
              <strong>Free Fire Custom #01</strong>
            </div>

            <div className="summary-row">
              <span>Players</span>
              <strong>38 / 50</strong>
            </div>

            <div className="summary-row">
              <span>Prize</span>
              <strong>₹1,000</strong>
            </div>

            <div className="summary-row total-row">
              <span>Entry Fee</span>
              <strong>₹50</strong>
            </div>
          </section>

          <div className="registration-note">
            🔒 Your details will be used only for tournament registration.
          </div>

          <button
            className="join-button registration-button"
            onClick={handleContinueToPayment}
            disabled={verifyingUid}
          >
            {verifyingUid
              ? "VERIFYING UID..."
              : "CONTINUE TO PAYMENT →"}
          </button>
        </main>
      </div>
    );
  }

  // ============================================================
  // PAYMENT — PHONEPE QR
  // ============================================================
  if (screen === "payment") {
    return (
      <div className="app">
        <main className="content payment-page">
          <div className="details-header">
            <button
              className="back-button"
              onClick={() => setScreen("registration")}
            >
              ←
            </button>

            <h2>Payment</h2>

            <div style={{ width: "40px" }}></div>
          </div>

          <section className="payment-intro">
            <div className="payment-icon">💜</div>

            <h1>Pay ₹50</h1>

            <p>
              Scan the PhonePe / UPI QR code below to pay your tournament
              entry fee.
            </p>
          </section>

          <section className="payment-summary">
            <div className="payment-title">
              <div className="game-icon">🔥</div>

              <div>
                <h3>Free Fire Custom #01</h3>
                <p>Today • 8:00 PM</p>
              </div>
            </div>

            <div className="payment-line">
              <span>Player</span>
              <strong>{playerName || "Player"}</strong>
            </div>

            <div className="payment-line">
              <span>Free Fire UID</span>
              <strong>{uid || "Not provided"}</strong>
            </div>

            <div className="payment-line">
              <span>Entry Fee</span>
              <strong>₹50</strong>
            </div>

            <div className="payment-line">
              <span>Your Slot</span>
              <strong>#39</strong>
            </div>

            <div className="payment-total">
              <span>Total Payable</span>
              <strong>₹50</strong>
            </div>
          </section>

          <section className="phonepe-payment-card">
            <div className="phonepe-badge">
              <span>पे</span>
              <strong>PhonePe</strong>
            </div>

            <div className="phonepe-qr-wrap">
              <img
                src="/phonepe-qr.png"
                alt="PhonePe UPI payment QR code"
                className="phonepe-qr"
              />
            </div>

            <h3>Scan & Pay ₹50</h3>

            <p>
              Scan this QR code with PhonePe, Google Pay, Paytm, BHIM or any
              UPI app.
            </p>

            <div className="upi-apps">
              <span>PhonePe</span>
              <span>GPay</span>
              <span>Paytm</span>
              <span>BHIM</span>
              <span>UPI</span>
            </div>
          </section>

          <div className="secure-payment">
            🔒 Pay ₹50 using your UPI app. After completing the payment,
            press the button below.
          </div>

          <button
            className="join-button payment-button"
            onClick={handlePaymentDone}
            disabled={paymentSubmitting}
          >
            {paymentSubmitting
              ? "CONFIRMING..."
              : "I HAVE PAID ₹50 →"}
          </button>

          <p className="payment-warning">
            Payment verification should be performed by the backend before
            a real tournament slot is confirmed.
          </p>
        </main>
      </div>
    );
  }

  // ============================================================
  // CONFIRMED
  // ============================================================
  if (screen === "confirmed") {
    return (
      <div className="app">
        <main className="content confirmed-page">
          <div className="success-icon">✓</div>

          <h1>Slot Confirmed!</h1>

          <p className="success-text">
            Your tournament registration is successful.
          </p>

          <section className="confirmed-card">
            <div className="confirmed-row">
              <span>Tournament</span>
              <strong>Free Fire Custom #01</strong>
            </div>

            <div className="confirmed-row">
              <span>Player</span>
              <strong>{playerName || "Player"}</strong>
            </div>

            <div className="confirmed-row">
              <span>Free Fire UID</span>
              <strong>{uid || "Not provided"}</strong>
            </div>

            <div className="confirmed-row">
              <span>Slot Number</span>
              <strong className="slot-number">#39</strong>
            </div>

            <div className="confirmed-row">
              <span>Entry Fee</span>
              <strong>₹50</strong>
            </div>

            <div className="confirmed-row">
              <span>Status</span>
              <strong className="confirmed-status">CONFIRMED</strong>
            </div>
          </section>

          <div className="room-info">
            🎮 Room ID & Password will be available before the match.
          </div>

          <button
            className="join-button"
            onClick={() => {
              setActiveTab("matches");
              setScreen("home");
            }}
          >
            GO TO MY MATCH →
          </button>
        </main>
      </div>
    );
  }

  // ============================================================
  // MY MATCHES
  // ============================================================
  if (activeTab === "matches") {
    return (
      <div className="app">
        <main className="content">
          <div className="matches-header">
            <div>
              <p className="small-text">Your tournaments</p>
              <h2>🎮 My Matches</h2>
            </div>

            <div className="match-count">1</div>
          </div>

          <section className="my-match-card">
            <div className="match-top">
              <div className="match-game-icon">🔥</div>

              <div className="match-title">
                <h3>Free Fire Custom #01</h3>
                <p>Today • 8:00 PM</p>
              </div>

              <span className="confirmed-badge">CONFIRMED</span>
            </div>

            <div className="match-divider"></div>

            <div className="match-details">
              <div>
                <span>YOUR SLOT</span>
                <strong>#39</strong>
              </div>

              <div>
                <span>ENTRY</span>
                <strong>₹50</strong>
              </div>

              <div>
                <span>PRIZE</span>
                <strong>₹1,000</strong>
              </div>
            </div>

            <div className="match-status">
              <span>🟢 Registration Successful</span>
            </div>

            <div className="room-locked">
              <div className="lock-icon">🔒</div>

              <div>
                <h4>Room Details</h4>

                <p>
                  Room ID & Password will be available before the match.
                </p>
              </div>
            </div>

            <button
              className="room-button"
              onClick={() =>
                alert("Room details will be available before the match.")
              }
            >
              VIEW ROOM DETAILS
            </button>
          </section>

          <section className="match-info-card">
            <h3>📋 Match Information</h3>

            <div className="match-info-row">
              <span>🎮 Game</span>
              <strong>Free Fire</strong>
            </div>

            <div className="match-info-row">
              <span>👥 Players</span>
              <strong>50</strong>
            </div>

            <div className="match-info-row">
              <span>🕐 Match Time</span>
              <strong>Today • 8:00 PM</strong>
            </div>

            <div className="match-info-row">
              <span>🏆 Winner Prize</span>
              <strong>₹1,000</strong>
            </div>
          </section>
        </main>

        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setScreen={setScreen}
        />
      </div>
    );
  }

  // ============================================================
  // TOURNAMENTS
  // ============================================================
  if (activeTab === "tournaments") {
    return (
      <div className="app">
        <main className="content">
          <div className="page">
            <h2>🏆 Tournaments</h2>

            <div className="empty-card">
              <div>🎮</div>

              <h3>Custom Tournaments</h3>

              <p>Join upcoming Free Fire battles.</p>

              <button
                className="join-button"
                onClick={() => {
                  setActiveTab("home");
                  setScreen("details");
                }}
              >
                VIEW TOURNAMENT
              </button>
            </div>
          </div>
        </main>

        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setScreen={setScreen}
        />
      </div>
    );
  }

  // ============================================================
  // WALLET
  // ============================================================
  if (activeTab === "wallet") {
    return (
      <div className="app">
        <main className="content">
          <div className="page">
            <h2>💰 Wallet</h2>

            <div className="wallet-card">
              <p>Available Balance</p>
              <h1>₹0.00</h1>
            </div>

            <div className="empty-card">
              <h3>Transaction History</h3>
              <p>No transactions yet.</p>
            </div>
          </div>
        </main>

        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setScreen={setScreen}
        />
      </div>
    );
  }

  // ============================================================
  // PROFILE
  // ============================================================
  if (activeTab === "profile") {
    return (
      <div className="app">
        <main className="content">
          <div className="page">
            <h2>👤 Profile</h2>

            <div className="profile-card">
              <div className="avatar">P</div>

              <div>
                <h3>{playerName || "Player"}</h3>
                <p>Free Fire Player</p>
              </div>
            </div>

            <div className="menu-card">
              <div>👤 Edit Profile</div>
              <div>🔐 Account Settings</div>
              <div>📜 Tournament History</div>
              <div>❓ Help & Support</div>

              <div
                className="admin-menu-item"
                onClick={() => setScreen("admin-login")}
              >
                🛡️ Admin Panel
              </div>
            </div>
          </div>
        </main>

        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setScreen={setScreen}
        />
      </div>
    );
  }

  // ============================================================
  // HOME
  // ============================================================
  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="small-text">Welcome back 👋</p>

          <h1>
            Custom<span>Tournament</span>
          </h1>
        </div>

        <button className="notification">🔔</button>
      </header>

      <main className="content">
        <section className="hero-card">
          <div className="hero-overlay">
            <div className="live-badge">● LIVE REGISTRATION</div>

            <h2>
              FREE FIRE
              <br />
              CUSTOM BATTLE
            </h2>

            <p className="hero-subtitle">
              50 Players • Custom Room
            </p>

            <div className="stats">
              <div>
                <span>ENTRY</span>
                <strong>₹50</strong>
              </div>

              <div>
                <span>PRIZE</span>
                <strong>₹1,000</strong>
              </div>

              <div>
                <span>SLOTS</span>
                <strong>38/50</strong>
              </div>
            </div>

            <button
              className="join-button"
              onClick={() => setScreen("details")}
            >
              JOIN TOURNAMENT →
            </button>
          </div>
        </section>

        <div className="section-title">
          <h2>Upcoming Tournaments</h2>

          <button onClick={() => setActiveTab("tournaments")}>
            View All
          </button>
        </div>

        <div
          className="tournament-card"
          onClick={() => setScreen("details")}
        >
          <div className="game-icon">🔥</div>

          <div className="tournament-info">
            <h3>Free Fire Custom #01</h3>

            <p>Today • 8:00 PM</p>

            <div className="mini-info">
              <span>👥 38/50</span>
              <span>💰 ₹1,000</span>
            </div>
          </div>

          <button
            className="arrow"
            onClick={(e) => {
              e.stopPropagation();
              setScreen("details");
            }}
          >
            ›
          </button>
        </div>

        <div className="tournament-card">
          <div className="game-icon">🏆</div>

          <div className="tournament-info">
            <h3>Night Battle</h3>

            <p>Tomorrow • 9:00 PM</p>

            <div className="mini-info">
              <span>👥 21/50</span>
              <span>💰 ₹1,000</span>
            </div>
          </div>

          <button className="arrow">›</button>
        </div>
      </main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setScreen={setScreen}
      />
    </div>
  );
}

// ============================================================
// BOTTOM NAVIGATION
// ============================================================
function BottomNav({
  activeTab,
  setActiveTab,
  setScreen,
}) {
  return (
    <nav className="bottom-nav">
      <button
        className={activeTab === "home" ? "active" : ""}
        onClick={() => {
          setActiveTab("home");
          setScreen("home");
        }}
      >
        <span>⌂</span>
        Home
      </button>

      <button
        className={activeTab === "tournaments" ? "active" : ""}
        onClick={() => {
          setActiveTab("tournaments");
          setScreen("home");
        }}
      >
        <span>🏆</span>
        Tournaments
      </button>

      <button
        className={activeTab === "matches" ? "active" : ""}
        onClick={() => {
          setActiveTab("matches");
          setScreen("home");
        }}
      >
        <span>🎮</span>
        Matches
      </button>

      <button
        className={activeTab === "wallet" ? "active" : ""}
        onClick={() => {
          setActiveTab("wallet");
          setScreen("home");
        }}
      >
        <span>₹</span>
        Wallet
      </button>

      <button
        className={activeTab === "profile" ? "active" : ""}
        onClick={() => {
          setActiveTab("profile");
          setScreen("home");
        }}
      >
        <span>👤</span>
        Profile
      </button>
    </nav>
  );
}

export default App;
