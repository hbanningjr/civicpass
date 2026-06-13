import { useState } from "react";
import { ethers } from "ethers";
import CivicPassCredential from "../contracts/CivicPassCredential.json";
import IssuerRegistry from "../contracts/IssuerRegistry.json";
import config from "../contracts/config.json";

function IssuerDashboard({ account }) {
  const [voterAddress, setVoterAddress] = useState("");
  const [electionId, setElectionId] = useState("");
  const [daysValid, setDaysValid] = useState("30");
  const [newIssuer, setNewIssuer] = useState("");
  const [revokeAddress, setRevokeAddress] = useState("");
  const [revokeElectionId, setRevokeElectionId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const issueCredential = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        config.civicPassCredential,
        CivicPassCredential.abi,
        signer
      );

      const expiration =
        Math.floor(Date.now() / 1000) + parseInt(daysValid) * 86400;

      const tx = await contract.issueCredential(
        voterAddress,
        electionId,
        expiration
      );
      showMessage("Transaction submitted! Waiting for confirmation...", "success");
      await tx.wait();
      showMessage(
        `✅ Credential issued successfully to ${voterAddress.slice(0, 6)}...${voterAddress.slice(-4)}`,
        "success"
      );
    } catch (err) {
      showMessage(`❌ Error: ${err.reason || err.message}`, "error");
    }
  };

  const revokeCredential = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        config.civicPassCredential,
        CivicPassCredential.abi,
        signer
      );

      const tx = await contract.revokeCredential(revokeAddress, revokeElectionId);
      showMessage("Transaction submitted! Waiting for confirmation...", "success");
      await tx.wait();
      showMessage(
        `✅ Credential revoked for ${revokeAddress.slice(0, 6)}...${revokeAddress.slice(-4)}`,
        "success"
      );
    } catch (err) {
      showMessage(`❌ Error: ${err.reason || err.message}`, "error");
    }
  };

  const authorizeIssuer = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        config.issuerRegistry,
        IssuerRegistry.abi,
        signer
      );

      const tx = await contract.authorizeIssuer(newIssuer);
      showMessage("Transaction submitted! Waiting for confirmation...", "success");
      await tx.wait();
      showMessage(
        `✅ Issuer authorized: ${newIssuer.slice(0, 6)}...${newIssuer.slice(-4)}`,
        "success"
      );
    } catch (err) {
      showMessage(`❌ Error: ${err.reason || err.message}`, "error");
    }
  };

  return (
    <div>
      <h2>🏛️ Issuer Dashboard</h2>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Manage credentials and authorized issuers.
      </p>

      {/* Issue Credential */}
      <div className="status-box" style={{ marginBottom: "20px" }}>
        <h3>Issue Credential</h3>
        <br />
        <label>Voter Wallet Address</label>
        <input
          placeholder="0x..."
          value={voterAddress}
          onChange={(e) => setVoterAddress(e.target.value)}
        />
        <label>Election ID</label>
        <input
          type="number"
          placeholder="e.g. 1"
          value={electionId}
          onChange={(e) => setElectionId(e.target.value)}
        />
        <label>Valid For (days)</label>
        <input
          type="number"
          placeholder="30"
          value={daysValid}
          onChange={(e) => setDaysValid(e.target.value)}
        />
        <button onClick={issueCredential}>Issue Credential</button>
      </div>

      {/* Revoke Credential */}
      <div className="status-box" style={{ marginBottom: "20px" }}>
        <h3>Revoke Credential</h3>
        <br />
        <label>Voter Wallet Address</label>
        <input
          placeholder="0x..."
          value={revokeAddress}
          onChange={(e) => setRevokeAddress(e.target.value)}
        />
        <label>Election ID</label>
        <input
          type="number"
          placeholder="e.g. 1"
          value={revokeElectionId}
          onChange={(e) => setRevokeElectionId(e.target.value)}
        />
        <button onClick={revokeCredential}>Revoke Credential</button>
      </div>

      {/* Authorize Issuer */}
      <div className="status-box">
        <h3>Authorize New Issuer</h3>
        <br />
        <label>Wallet Address to Authorize</label>
        <input
          placeholder="0x..."
          value={newIssuer}
          onChange={(e) => setNewIssuer(e.target.value)}
        />
        <button onClick={authorizeIssuer}>Authorize Issuer</button>
      </div>

      {message && (
        <p className={messageType === "success" ? "success" : "error"}>
          {message}
        </p>
      )}
    </div>
  );
}

export default IssuerDashboard;