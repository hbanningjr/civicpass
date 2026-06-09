import { useState } from "react";
import { ethers } from "ethers";
import CivicPassCredential from "../contracts/CivicPassCredential.json";
import config from "../contracts/config.json";

function VerifierDashboard({ account }) {
  const [voterAddress, setVoterAddress] = useState("");
  const [electionId, setElectionId] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const verifyCredential = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(
        "https://sepolia.infura.io/v3/1cac9a9396464ebaa5b4ef91257c7704",
      );
      const contract = new ethers.Contract(
        config.civicPassCredential,
        CivicPassCredential.abi,
        provider,
      );

      const result = await contract.verifyCredential(voterAddress, electionId);

      setStatus({
        exists: result.exists,
        valid: result.valid,
        revoked: result.revoked,
        used: result.used,
        expired: result.expired,
      });
      setMessage("");
    } catch (err) {
      showMessage("❌ Error verifying credential.", "error");
      setStatus(null);
    }
  };

  const markAsUsed = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        config.civicPassCredential,
        CivicPassCredential.abi,
        signer,
      );

      const tx = await contract.markCredentialUsed(voterAddress, electionId);
      showMessage(
        "Transaction submitted! Waiting for confirmation...",
        "success",
      );
      await tx.wait();
      showMessage(
        `✅ Credential marked as used. Voter has checked in successfully.`,
        "success",
      );

      // Refresh status
      await verifyCredential();
    } catch (err) {
      showMessage(`❌ Error: ${err.reason || err.message}`, "error");
    }
  };

  return (
    <div>
      <h2>🔍 Verifier Dashboard</h2>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Verify voter credentials at the polling place.
      </p>

      <label>Voter Wallet Address</label>
      <input
        placeholder='0x...'
        value={voterAddress}
        onChange={(e) => setVoterAddress(e.target.value)}
      />

      <label>Election ID</label>
      <input
        type='number'
        placeholder='e.g. 1'
        value={electionId}
        onChange={(e) => setElectionId(e.target.value)}
      />

      <button onClick={verifyCredential}>Verify Credential</button>

      {status && (
        <div className='status-box' style={{ marginTop: "20px" }}>
          <h3>Verification Result</h3>
          <div className='status-row'>
            <span>Credential Exists</span>
            <span className={status.exists ? "valid" : "invalid"}>
              {status.exists ? "✅ Yes" : "❌ No"}
            </span>
          </div>
          <div className='status-row'>
            <span>Valid</span>
            <span className={status.valid ? "valid" : "invalid"}>
              {status.valid ? "✅ Yes" : "❌ No"}
            </span>
          </div>
          <div className='status-row'>
            <span>Revoked</span>
            <span className={status.revoked ? "invalid" : "valid"}>
              {status.revoked ? "❌ Yes" : "✅ No"}
            </span>
          </div>
          <div className='status-row'>
            <span>Already Used</span>
            <span className={status.used ? "invalid" : "valid"}>
              {status.used ? "❌ Yes" : "✅ No"}
            </span>
          </div>
          <div className='status-row'>
            <span>Expired</span>
            <span className={status.expired ? "invalid" : "valid"}>
              {status.expired ? "❌ Yes" : "✅ No"}
            </span>
          </div>

          {status.valid && (
            <div style={{ marginTop: "16px" }}>
              <p className='success'>
                ✅ Credential is valid! Voter is cleared to proceed.
              </p>
              <button
                onClick={markAsUsed}
                style={{ background: "#4CAF50", marginTop: "10px" }}
              >
                ✅ Mark as Used — Check Voter In
              </button>
            </div>
          )}

          {!status.valid && status.exists && (
            <p className='error' style={{ marginTop: "16px" }}>
              ❌ Credential is not valid. Voter cannot be checked in.
            </p>
          )}

          {!status.exists && (
            <p className='error' style={{ marginTop: "16px" }}>
              ❌ No credential found for this wallet and election ID.
            </p>
          )}
        </div>
      )}

      {message && (
        <p className={messageType === "success" ? "success" : "error"}>
          {message}
        </p>
      )}
    </div>
  );
}

export default VerifierDashboard;
