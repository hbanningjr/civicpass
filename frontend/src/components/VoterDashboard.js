import { useState } from "react";
import { ethers } from "ethers";
import CivicPassCredential from "../contracts/CivicPassCredential.json";
import config from "../contracts/config.json";

function VoterDashboard({ account }) {
  const [electionId, setElectionId] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const checkCredential = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        config.civicPassCredential,
        CivicPassCredential.abi,
        provider
      );

      const result = await contract.verifyCredential(account, electionId);

      setStatus({
        exists: result.exists,
        valid: result.valid,
        revoked: result.revoked,
        used: result.used,
        expired: result.expired,
      });
      setMessage("");
    } catch (err) {
      setMessage("Error checking credential. Make sure Election ID is valid.");
      setStatus(null);
    }
  };

  return (
    <div>
      <h2>🗳️ Voter Dashboard</h2>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Check your credential status for a specific election.
      </p>

      <label>Your Wallet Address</label>
      <input value={account} disabled />

      <label>Election ID</label>
      <input
        type="number"
        placeholder="Enter Election ID (e.g. 1)"
        value={electionId}
        onChange={(e) => setElectionId(e.target.value)}
      />

      <button onClick={checkCredential}>Check My Credential</button>

      {message && <p className="error">{message}</p>}

      {status && (
        <div className="status-box">
          <h3>Credential Status</h3>
          <div className="status-row">
            <span>Credential Exists</span>
            <span className={status.exists ? "valid" : "invalid"}>
              {status.exists ? "✅ Yes" : "❌ No"}
            </span>
          </div>
          <div className="status-row">
            <span>Valid</span>
            <span className={status.valid ? "valid" : "invalid"}>
              {status.valid ? "✅ Yes" : "❌ No"}
            </span>
          </div>
          <div className="status-row">
            <span>Revoked</span>
            <span className={status.revoked ? "invalid" : "valid"}>
              {status.revoked ? "❌ Yes" : "✅ No"}
            </span>
          </div>
          <div className="status-row">
            <span>Used</span>
            <span className={status.used ? "invalid" : "valid"}>
              {status.used ? "❌ Yes" : "✅ No"}
            </span>
          </div>
          <div className="status-row">
            <span>Expired</span>
            <span className={status.expired ? "invalid" : "valid"}>
              {status.expired ? "❌ Yes" : "✅ No"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoterDashboard;