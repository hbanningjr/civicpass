import { useState } from "react";
import { ethers } from "ethers";
import IssuerRegistry from "../contracts/IssuerRegistry.json";
import config from "../contracts/config.json";

function AdminPortal({ account, onExit }) {
  const [newIssuer, setNewIssuer] = useState("");
  const [revokeIssuer, setRevokeIssuer] = useState("");
  const [checkAddress, setCheckAddress] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const authorizeIssuer = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        config.issuerRegistry,
        IssuerRegistry.abi,
        signer,
      );
      const tx = await contract.authorizeIssuer(newIssuer);
      showMessage(
        "Transaction submitted! Waiting for confirmation...",
        "success",
      );
      await tx.wait();
      showMessage(
        `✅ Issuer authorized: ${newIssuer.slice(0, 6)}...${newIssuer.slice(
          -4,
        )}`,
        "success",
      );
      setNewIssuer("");
    } catch (err) {
      showMessage(`❌ Error: ${err.reason || err.message}`, "error");
    }
  };

  const revokeIssuerAccess = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        config.issuerRegistry,
        IssuerRegistry.abi,
        signer,
      );
      const tx = await contract.revokeIssuer(revokeIssuer);
      showMessage(
        "Transaction submitted! Waiting for confirmation...",
        "success",
      );
      await tx.wait();
      showMessage(
        `✅ Issuer revoked: ${revokeIssuer.slice(0, 6)}...${revokeIssuer.slice(
          -4,
        )}`,
        "success",
      );
      setRevokeIssuer("");
    } catch (err) {
      showMessage(`❌ Error: ${err.reason || err.message}`, "error");
    }
  };

  const checkIssuerStatus = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(
        "https://sepolia.infura.io/v3/1cac9a9396464ebaa5b4ef91257c7704",
      );
      const contract = new ethers.Contract(
        config.issuerRegistry,
        IssuerRegistry.abi,
        provider,
      );
      const result = await contract.isAuthorizedIssuer(checkAddress);
      setCheckResult(result);
      showMessage("", "");
    } catch (err) {
      showMessage(`❌ Error: ${err.reason || err.message}`, "error");
    }
  };

  return (
    <div className='portal'>
      <div className='portal-header admin-header'>
        <div>
          <h1>🏛️ Admin Portal</h1>
          <p>Election Administrator — Full System Control</p>
          <span className='account-badge'>
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
        <button className='exit-btn' onClick={onExit}>
          ← Exit Portal
        </button>
      </div>

      <div className='portal-content'>
        {/* Authorize Issuer */}
        <div className='card admin-card'>
          <h2>Authorize New Issuer</h2>
          <p className='subtitle'>
            Grant a wallet address permission to issue voter credentials.
          </p>
          <label>Wallet Address to Authorize</label>
          <input
            placeholder='0x...'
            value={newIssuer}
            onChange={(e) => setNewIssuer(e.target.value)}
          />
          <button className='btn btn-admin' onClick={authorizeIssuer}>
            Authorize Issuer
          </button>
        </div>

        <hr className='divider' />

        {/* Revoke Issuer */}
        <div className='card admin-card'>
          <h2>Revoke Issuer Access</h2>
          <p className='subtitle'>
            Remove an issuer's permission to issue voter credentials.
          </p>
          <label>Wallet Address to Revoke</label>
          <input
            placeholder='0x...'
            value={revokeIssuer}
            onChange={(e) => setRevokeIssuer(e.target.value)}
          />
          <button className='btn btn-danger' onClick={revokeIssuerAccess}>
            Revoke Issuer
          </button>
        </div>

        <hr className='divider' />

        {/* Check Issuer Status */}
        <div className='card admin-card'>
          <h2>Check Issuer Status</h2>
          <p className='subtitle'>
            Verify whether a wallet address is currently an authorized issuer.
          </p>
          <label>Wallet Address to Check</label>
          <input
            placeholder='0x...'
            value={checkAddress}
            onChange={(e) => setCheckAddress(e.target.value)}
          />
          <button className='btn btn-admin' onClick={checkIssuerStatus}>
            Check Status
          </button>
          {checkResult !== null && (
            <div className='status-box' style={{ marginTop: "16px" }}>
              <div className='status-row'>
                <span>Authorized Issuer</span>
                <span className={checkResult ? "valid" : "invalid"}>
                  {checkResult ? "✅ Yes" : "❌ No"}
                </span>
              </div>
            </div>
          )}
        </div>

        {message && (
          <p className={messageType === "success" ? "success" : "error"}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminPortal;
