import { useState } from "react";
import IssuerDashboard from "./components/IssuerDashboard";
import VoterDashboard from "./components/VoterDashboard";
import VerifierDashboard from "./components/VerifierDashboard";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [activeTab, setActiveTab] = useState("voter");

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className='App'>
      <header>
        <h1>🗳️ CivicPass</h1>
        <p>Blockchain Credential Verification</p>
        {account ? (
          <p className='account'>
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>

      <nav>
        <button
          className={activeTab === "issuer" ? "active" : ""}
          onClick={() => setActiveTab("issuer")}
        >
          Issuer Dashboard
        </button>
        <button
          className={activeTab === "voter" ? "active" : ""}
          onClick={() => setActiveTab("voter")}
        >
          Voter Dashboard
        </button>
        <button
          className={activeTab === "verifier" ? "active" : ""}
          onClick={() => setActiveTab("verifier")}
        >
          Verifier Dashboard
        </button>
      </nav>

      <main>
        {!account ? (
          <div className='connect-prompt'>
            <h2>Please connect your wallet to continue</h2>
            <button onClick={connectWallet}>Connect MetaMask</button>
          </div>
        ) : (
          <>
            {activeTab === "issuer" && <IssuerDashboard account={account} />}
            {activeTab === "voter" && <VoterDashboard account={account} />}
            {activeTab === "verifier" && (
              <VerifierDashboard account={account} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
