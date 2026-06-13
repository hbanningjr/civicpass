import { useState } from "react";
import { ethers } from "ethers";
import CivicPassCredential from "../contracts/CivicPassCredential.json";
import config from "../contracts/config.json";

function IssuerPortal({ account, onExit }) {
  const [voterAddress, setVoterAddress] = useState("");
  const [electionId, setElectionId] = useState("");
  const [daysValid, setDaysValid] = useState("30");
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
        signer,
      );
      const expiration =
        Math.floor(Date.now() / 1000) + parseInt(daysValid) * 86400;
      const tx = await contract.issueCredential(
        voterAddress,
        electionId,
        expiration,
      );
      showMessage(
        "Transaction submitted! Waiting for confirmation...",
        "success",
      );
      await tx.wait();
      showMessage(
        `✅ Credential issued to ${voterAddress.slice(
          0,
          6,
        )}...${voterAddress.slice(-4)} for Election ${electionId}`,
        "success",
      );
      setVoterAddress("");
      setElectionId("");
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
        signer,
      );
      const tx = await contract.revokeCredential(
        revokeAddress,
        revokeElectionId,
      );
      showMessage(
        "Transaction submitted! Waiting for confirmation...",
        "success",
      );
      await tx.wait();
      showMessage(
        `✅ Credential revoked for ${revokeAddress.slice(
          0,
          6,
        )}...${revokeAddress.slice(-4)}`,
        "success",
      );
      setRevokeAddress("");
      setRevokeElectionId("");
    } catch (err) {
      showMessage(`❌ Error: ${err.reason || err.message}`, "error");
    }
  };

  return (
    <div className='portal'>
      <div className='portal-header issuer-header'>
        <div>
          <h1>📋 Issuer Portal</h1>
          <p>Authorized Credential Issuer</p>
          <span className='account-badge'>
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
        <button className='exit-btn' onClick={onExit}>
          ← Exit Portal
        </button>
      </div>

      <div className='portal-content'>
        {/* Issue Credential */}
        <div className='card issuer-card'>
          <h2>Issue Voter Credential</h2>
          <p className='subtitle'>
            Issue a blockchain credential to a verified voter's wallet address
            for a specific election.
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
          <label>Valid For (days)</label>
          <input
            type='number'
            placeholder='30'
            value={daysValid}
            onChange={(e) => setDaysValid(e.target.value)}
          />
          <button className='btn btn-issuer' onClick={issueCredential}>
            Issue Credential
          </button>
        </div>

        <hr className='divider' />

        {/* Revoke Credential */}
        <div className='card issuer-card'>
          <h2>Revoke Voter Credential</h2>
          <p className='subtitle'>
            Revoke a previously issued credential. The voter will no longer be
            able to check in with this credential.
          </p>
          <label>Voter Wallet Address</label>
          <input
            placeholder='0x...'
            value={revokeAddress}
            onChange={(e) => setRevokeAddress(e.target.value)}
          />
          <label>Election ID</label>
          <input
            type='number'
            placeholder='e.g. 1'
            value={revokeElectionId}
            onChange={(e) => setRevokeElectionId(e.target.value)}
          />
          <button className='btn btn-danger' onClick={revokeCredential}>
            Revoke Credential
          </button>
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

export default IssuerPortal;
