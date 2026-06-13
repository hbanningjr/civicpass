import { useState } from "react";
import { ethers } from "ethers";
import CivicPassCredential from "../contracts/CivicPassCredential.json";
import config from "../contracts/config.json";

function VerifierPortal({ account, onExit }) {
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
      showMessage(
        "❌ Error verifying credential. Check the wallet address and Election ID.",
        "error",
      );
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
        "✅ Voter successfully checked in! Credential marked as used.",
        "success",
      );
      await verifyCredential();
    } catch (err) {
      showMessage(`❌ Error: ${err.reason || err.message}`, "error");
    }
  };

  return (
    <div className='portal'>
      <div className='portal-header verifier-header'>
        <div>
          <h1>🔍 Verifier Portal</h1>
          <p>Poll Worker — Voter Check-In Station</p>
          <span className='account-badge'>
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
        <button className='exit-btn' onClick={onExit}>
          ← Exit Portal
        </button>
      </div>

      <div className='portal-content'>
        <div className='card verifier-card'>
          <h2>Verify Voter Credential</h2>
          <p className='subtitle'>
            Enter the voter's wallet address and election ID to verify their
            eligibility and check them in.
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

          <button className='btn btn-verifier' onClick={verifyCredential}>
            Verify Credential
          </button>

          {status && (
            <div className='status-box' style={{ marginTop: "24px" }}>
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
                <div style={{ marginTop: "20px" }}>
                  <p className='success'>
                    ✅ Credential is valid! Voter is cleared to proceed.
                  </p>
                  <button
                    className='btn btn-success'
                    style={{ marginTop: "12px" }}
                    onClick={markAsUsed}
                  >
                    ✅ Check Voter In — Mark as Used
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
            <p
              className={messageType === "success" ? "success" : "error"}
              style={{ marginTop: "16px" }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifierPortal;
